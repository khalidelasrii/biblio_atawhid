import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Cart, CartItem, Product, ShippingAddress, PaymentMethod, Order, User, AdminUser } from '../types';

export class CartService {
    private static CART_COLLECTION = 'carts';
    private static ORDER_COLLECTION = 'orders';

    // Générer un ID unique pour le panier anonyme
    private static generateAnonymousCartId(): string {
        return 'anonymous_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Générer un numéro de commande unique
    private static generateOrderNumber(): string {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD${year}${month}${day}${random}`;
    }

    // Récupérer ou créer un panier
    static async getCart(userId?: string): Promise<Cart> {
        try {
            let cartId: string;

            if (userId) {
                // Chercher un panier existant pour l'utilisateur
                const cartsRef = collection(db, this.CART_COLLECTION);
                const q = query(cartsRef, where('userId', '==', userId));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const cartDoc = snapshot.docs[0];
                    return { id: cartDoc.id, ...cartDoc.data() } as Cart;
                }
                cartId = userId;
            } else {
                // Panier anonyme - chercher dans le localStorage
                cartId = localStorage.getItem('anonymousCartId') || this.generateAnonymousCartId();
                localStorage.setItem('anonymousCartId', cartId);
            }

            // Créer un nouveau panier
            return await this.createCart(userId);
        } catch (error) {
            console.error('Erreur lors de la récupération du panier:', error);
            throw error;
        }
    }

    // Créer un nouveau panier
    static async createCart(userId?: string): Promise<Cart> {
        try {
            const cartData = {
                userId: userId || null,
                items: [],
                totalItems: 0,
                totalPrice: 0,
                currency: 'MAD',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, this.CART_COLLECTION), cartData);

            return {
                id: docRef.id,
                ...cartData,
                createdAt: new Date(),
                updatedAt: new Date()
            } as Cart;
        } catch (error) {
            console.error('Erreur lors de la création du panier:', error);
            throw error;
        }
    }

    // Ajouter un item au panier
    static async addItem(
        cartId: string,
        product: Product,
        quantity: number = 1,
        options?: Record<string, string>
    ): Promise<Cart> {
        try {
            const cartRef = doc(db, this.CART_COLLECTION, cartId);
            const cartDoc = await getDoc(cartRef);

            if (!cartDoc.exists()) {
                throw new Error('Panier non trouvé');
            }

            const cart = { id: cartId, ...cartDoc.data() } as Cart;

            // Vérifier si l'item existe déjà
            const existingItemIndex = cart.items.findIndex(item =>
                item.product.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(options)
            );

            if (existingItemIndex >= 0) {
                // Mettre à jour la quantité
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Ajouter nouvel item
                const newItem: CartItem = {
                    id: Date.now().toString() + Math.random().toString(36).substring(2),
                    product,
                    quantity,
                    selectedOptions: options
                };
                cart.items.push(newItem);
            }

            // Recalculer les totaux
            cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            cart.updatedAt = new Date();

            // Sauvegarder
            await updateDoc(cartRef, {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice,
                updatedAt: serverTimestamp()
            });

            return cart;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'item:', error);
            throw error;
        }
    }

    // Mettre à jour la quantité d'un item
    static async updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Cart> {
        try {
            const cartRef = doc(db, this.CART_COLLECTION, cartId);
            const cartDoc = await getDoc(cartRef);

            if (!cartDoc.exists()) {
                throw new Error('Panier non trouvé');
            }

            const cart = { id: cartId, ...cartDoc.data() } as Cart;

            const itemIndex = cart.items.findIndex(item => item.id === itemId);
            if (itemIndex === -1) {
                throw new Error('Item non trouvé');
            }

            cart.items[itemIndex].quantity = quantity;

            // Recalculer les totaux
            cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            cart.updatedAt = new Date();

            // Sauvegarder
            await updateDoc(cartRef, {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice,
                updatedAt: serverTimestamp()
            });

            return cart;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité:', error);
            throw error;
        }
    }

    // Supprimer un item du panier
    static async removeItem(cartId: string, itemId: string): Promise<Cart> {
        try {
            const cartRef = doc(db, this.CART_COLLECTION, cartId);
            const cartDoc = await getDoc(cartRef);

            if (!cartDoc.exists()) {
                throw new Error('Panier non trouvé');
            }

            const cart = { id: cartId, ...cartDoc.data() } as Cart;

            cart.items = cart.items.filter(item => item.id !== itemId);

            // Recalculer les totaux
            cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            cart.updatedAt = new Date();

            // Sauvegarder
            await updateDoc(cartRef, {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice,
                updatedAt: serverTimestamp()
            });

            return cart;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'item:', error);
            throw error;
        }
    }

    // Vider le panier
    static async clearCart(cartId: string): Promise<Cart> {
        try {
            const cartRef = doc(db, this.CART_COLLECTION, cartId);

            const updatedData = {
                items: [],
                totalItems: 0,
                totalPrice: 0,
                updatedAt: serverTimestamp()
            };

            await updateDoc(cartRef, updatedData);

            return {
                id: cartId,
                items: [],
                totalItems: 0,
                totalPrice: 0,
                currency: 'MAD',
                updatedAt: new Date(),
                createdAt: new Date()
            } as Cart;
        } catch (error) {
            console.error('Erreur lors du vidage du panier:', error);
            throw error;
        }
    }

    // Créer une commande
    static async createOrder(
        cart: Cart,
        shippingAddress: ShippingAddress,
        paymentMethod: PaymentMethod,
        user?: User | AdminUser | null
    ): Promise<Order> {
        try {
            if (!cart.items.length) {
                throw new Error('Le panier est vide');
            }

            const orderData = {
                orderNumber: this.generateOrderNumber(),
                userId: user?.id || null,
                customerInfo: {
                    name: shippingAddress.fullName,
                    email: shippingAddress.email,
                    phone: shippingAddress.phone
                },
                shippingAddress,
                items: cart.items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    selectedOptions: item.selectedOptions
                })),
                totalAmount: cart.totalPrice,
                currency: cart.currency,
                paymentMethod,
                statusHistory: [{
                    status: 'pending' as const,
                    date: new Date(),
                    note: 'Commande créée'
                }],
                currentStatus: 'pending' as const,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, this.ORDER_COLLECTION), orderData);

            return {
                id: docRef.id,
                ...orderData,
                createdAt: new Date(),
                updatedAt: new Date()
            } as Order;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    // Récupérer les commandes d'un utilisateur
    static async getUserOrders(userId: string): Promise<Order[]> {
        try {
            const ordersRef = collection(db, this.ORDER_COLLECTION);
            const q = query(
                ordersRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Order[];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    // Récupérer toutes les commandes (admin)
    static async getAllOrders(): Promise<Order[]> {
        try {
            const ordersRef = collection(db, this.ORDER_COLLECTION);
            const q = query(ordersRef, orderBy('createdAt', 'desc'));

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Order[];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    // Mettre à jour le statut d'une commande
    static async updateOrderStatus(
        orderId: string,
        newStatus: Order['currentStatus'],
        note?: string
    ): Promise<void> {
        try {
            const orderRef = doc(db, this.ORDER_COLLECTION, orderId);
            const orderDoc = await getDoc(orderRef);

            if (!orderDoc.exists()) {
                throw new Error('Commande non trouvée');
            }

            const order = orderDoc.data() as Order;
            const newStatusEntry = {
                status: newStatus,
                date: new Date(),
                note: note || `Statut mis à jour: ${newStatus}`
            };

            await updateDoc(orderRef, {
                currentStatus: newStatus,
                statusHistory: [...(order.statusHistory || []), newStatusEntry],
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            throw error;
        }
    }
}
