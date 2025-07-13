import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cart, updateCartItem, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <h2 className="text-lg font-medium text-gray-900">
                            Panier ({getCartItemsCount()})
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-md text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        {!cart || cart.items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Votre panier est vide
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Ajoutez des articles à votre panier pour commencer vos achats.
                                </p>
                                <Button onClick={onClose} variant="outline">
                                    Continuer les achats
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                                        {/* Image */}
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={item.product.images[0] || '/placeholder-book.jpg'}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(item.product.price)}
                                            </p>
                                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                        <span key={key} className="mr-2">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                                                disabled={item.quantity >= item.product.stock}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="rounded-full p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart && cart.items.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-base font-medium text-gray-900">Total</span>
                                <span className="text-lg font-bold text-orange-600">
                                    {formatPrice(getCartTotal())}
                                </span>
                            </div>
                            <Button
                                onClick={handleCheckout}
                                className="w-full"
                                size="lg"
                            >
                                Passer la commande
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
