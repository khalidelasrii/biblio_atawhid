import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, Product, ShippingAddress, PaymentMethod, Order } from '../types';
import { CartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (product: Product, quantity?: number, options?: Record<string, string>) => Promise<void>;
    updateCartItem: (itemId: string, quantity: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
    createOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Promise<Order>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    // Charger le panier au démarrage
    useEffect(() => {
        loadCart();
    }, [currentUser]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const cartData = await CartService.getCart(currentUser?.id);
            setCart(cartData);
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
            // Créer un panier vide en cas d'erreur
            const emptyCart = await CartService.createCart(currentUser?.id);
            setCart(emptyCart);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: Product, quantity = 1, options?: Record<string, string>) => {
        try {
            if (!cart) return;

            // Vérifier le stock
            if (product.stock < quantity) {
                toast.error('Stock insuffisant');
                return;
            }

            const updatedCart = await CartService.addItem(cart.id, product, quantity, options);
            setCart(updatedCart);
            toast.success(`${product.name} ajouté au panier`);
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            toast.error('Erreur lors de l\'ajout au panier');
        }
    };

    const updateCartItem = async (itemId: string, quantity: number) => {
        try {
            if (!cart) return;

            if (quantity <= 0) {
                await removeFromCart(itemId);
                return;
            }

            const updatedCart = await CartService.updateItemQuantity(cart.id, itemId, quantity);
            setCart(updatedCart);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du panier:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            if (!cart) return;

            const updatedCart = await CartService.removeItem(cart.id, itemId);
            setCart(updatedCart);
            toast.success('Article retiré du panier');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const clearCart = async () => {
        try {
            if (!cart) return;

            const updatedCart = await CartService.clearCart(cart.id);
            setCart(updatedCart);
            toast.success('Panier vidé');
        } catch (error) {
            console.error('Erreur lors du vidage du panier:', error);
            toast.error('Erreur lors du vidage du panier');
        }
    };

    const getCartTotal = () => {
        if (!cart) return 0;
        return cart.totalPrice;
    };

    const getCartItemsCount = () => {
        if (!cart) return 0;
        return cart.totalItems;
    };

    const createOrder = async (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Promise<Order> => {
        try {
            if (!cart || cart.items.length === 0) {
                throw new Error('Le panier est vide');
            }

            const order = await CartService.createOrder(cart, shippingAddress, paymentMethod, currentUser);

            // Vider le panier après la commande
            await clearCart();

            toast.success('Commande créée avec succès!');
            return order;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            toast.error('Erreur lors de la création de la commande');
            throw error;
        }
    };

    const value: CartContextType = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        createOrder
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
