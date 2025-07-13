import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    where,
    getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Message } from '../types';

// Utilitaire pour nettoyer les données avant Firestore
const cleanDataForFirestore = (data: any) => {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
            cleaned[key] = value;
        }
    }
    return cleaned;
};

// Service pour la gestion des produits
export class ProductService {
    // Ajouter un produit
    static async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const cleanedData = cleanDataForFirestore({
                ...productData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const docRef = await addDoc(collection(db, 'products'), cleanedData);
            return docRef.id;
        } catch (error: any) {
            console.error('Erreur ajout produit:', error);
            throw new Error('Erreur lors de l\'ajout du produit');
        }
    }

    // Récupérer tous les produits
    static async getAllProducts(): Promise<Product[]> {
        try {
            const q = query(collection(db, 'products'));
            const querySnapshot = await getDocs(q);

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Product[];

            // Trier côté client par date de création (décroissant)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error: any) {
            console.error('Erreur récupération produits:', error);
            throw new Error('Erreur lors de la récupération des produits');
        }
    }

    // Récupérer les produits actifs
    static async getActiveProducts(): Promise<Product[]> {
        try {
            const q = query(
                collection(db, 'products'),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Product[];

            // Trier côté client par date de création (décroissant)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error: any) {
            console.error('Erreur récupération produits actifs:', error);
            throw new Error('Erreur lors de la récupération des produits');
        }
    }

    // Récupérer les produits par catégorie
    static async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const q = query(
                collection(db, 'products'),
                where('category', '==', category),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Product[];

            // Trier côté client par date de création (décroissant)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error: any) {
            console.error('Erreur récupération produits par catégorie:', error);
            throw new Error('Erreur lors de la récupération des produits');
        }
    }

    // Rechercher des produits
    static async searchProducts(searchTerm: string): Promise<Product[]> {
        try {
            // Note: Firestore ne supporte pas la recherche de texte complète
            // Nous devrons faire la recherche côté client ou utiliser Algolia pour une recherche avancée
            const q = query(
                collection(db, 'products'),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            const allProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Product[];

            // Trier par date de création (décroissant)
            const sortedProducts = allProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            // Filtrer côté client
            const searchTermLower = searchTerm.toLowerCase();
            return sortedProducts.filter(product =>
                product.name.toLowerCase().includes(searchTermLower) ||
                product.description.toLowerCase().includes(searchTermLower) ||
                product.category.toLowerCase().includes(searchTermLower) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
            );
        } catch (error: any) {
            console.error('Erreur recherche produits:', error);
            throw new Error('Erreur lors de la recherche');
        }
    }

    // Récupérer les produits par sous-catégorie
    static async getProductsBySubcategory(subcategory: string): Promise<Product[]> {
        try {
            const q = query(
                collection(db, 'products'),
                where('subcategory', '==', subcategory),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Product[];

            // Trier côté client par date de création (décroissant)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error: any) {
            console.error('Erreur récupération produits par sous-catégorie:', error);
            throw new Error('Erreur lors de la récupération des produits');
        }
    }

    // Mettre à jour un produit
    static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
        try {
            const cleanedUpdates = cleanDataForFirestore({
                ...updates,
                updatedAt: serverTimestamp()
            });

            await updateDoc(doc(db, 'products', id), cleanedUpdates);
        } catch (error: any) {
            console.error('Erreur mise à jour produit:', error);
            throw new Error('Erreur lors de la mise à jour du produit');
        }
    }

    // Supprimer un produit
    static async deleteProduct(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error: any) {
            console.error('Erreur suppression produit:', error);
            throw new Error('Erreur lors de la suppression du produit');
        }
    }

    // Récupérer un produit par ID
    static async getProductById(id: string): Promise<Product | null> {
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                    updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
                } as Product;
            }
            return null;
        } catch (error: any) {
            console.error('Erreur récupération produit:', error);
            throw new Error('Erreur lors de la récupération du produit');
        }
    }
}

// Service pour la gestion des messages
export class MessageService {
    // Ajouter un message de contact
    static async addMessage(messageData: Omit<Message, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'messages'), {
                ...messageData,
                isRead: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error: any) {
            console.error('Erreur ajout message:', error);
            throw new Error('Erreur lors de l\'envoi du message');
        }
    }

    // Récupérer tous les messages
    static async getAllMessages(): Promise<Message[]> {
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as Message[];
        } catch (error: any) {
            console.error('Erreur récupération messages:', error);
            throw new Error('Erreur lors de la récupération des messages');
        }
    }

    // Marquer un message comme lu
    static async markAsRead(id: string): Promise<void> {
        try {
            await updateDoc(doc(db, 'messages', id), {
                isRead: true,
                updatedAt: serverTimestamp()
            });
        } catch (error: any) {
            console.error('Erreur marquage message lu:', error);
            throw new Error('Erreur lors du marquage du message');
        }
    }

    // Supprimer un message
    static async deleteMessage(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'messages', id));
        } catch (error: any) {
            console.error('Erreur suppression message:', error);
            throw new Error('Erreur lors de la suppression du message');
        }
    }

    // Compter les messages non lus
    static async getUnreadCount(): Promise<number> {
        try {
            const q = query(collection(db, 'messages'), where('isRead', '==', false));
            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error: any) {
            console.error('Erreur comptage messages non lus:', error);
            return 0;
        }
    }
}
