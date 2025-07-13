import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

interface SimpleCartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartItemsCount: () => number;
    getCartTotal: () => number;
}

const SimpleCartContext = createContext<SimpleCartContextType | undefined>(undefined);

export const useSimpleCart = () => {
    const context = useContext(SimpleCartContext);
    if (context === undefined) {
        throw new Error('useSimpleCart must be used within a SimpleCartProvider');
    }
    return context;
};

interface SimpleCartProviderProps {
    children: React.ReactNode;
}

export const SimpleCartProvider: React.FC<SimpleCartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('biblio-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Erreur chargement panier:', error);
                localStorage.removeItem('biblio-cart');
            }
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('biblio-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.product.id === product.id);

            if (existingItem) {
                // Mettre à jour la quantité
                return currentItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Ajouter un nouvel item
                return [...currentItems, {
                    id: product.id,
                    product,
                    quantity
                }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartItemsCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const value: SimpleCartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemsCount,
        getCartTotal
    };

    return (
        <SimpleCartContext.Provider value={value}>
            {children}
        </SimpleCartContext.Provider>
    );
};
