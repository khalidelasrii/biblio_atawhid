import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShippingAddress, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, createOrder, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Maroc'
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
        type: 'cash_on_delivery'
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(price);
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone ||
            !shippingAddress.address || !shippingAddress.city) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setStep(2);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleOrderConfirmation = async () => {
        try {
            setLoading(true);
            const order = await createOrder(shippingAddress, paymentMethod);
            toast.success(`Commande créée avec succès! Numéro: ${order.orderNumber}`);
            navigate('/order-success', { state: { order } });
        } catch (error: any) {
            console.error('Erreur lors de la création de la commande:', error);
            toast.error('Erreur lors de la création de la commande');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h2>
                    <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
                    <Button onClick={() => navigate('/products')}>
                        Voir les produits
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-orange-500 mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Finaliser la commande</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <span className="ml-2 font-medium">Livraison</span>
                        </div>

                        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />

                        <div className={`flex items-center ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                            </div>
                            <span className="ml-2 font-medium">Paiement</span>
                        </div>

                        <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`} />

                        <div className={`flex items-center ${step >= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span className="ml-2 font-medium">Confirmation</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-6">
                                    <Truck className="w-6 h-6 text-orange-500 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">Adresse de livraison</h2>
                                </div>

                                <form onSubmit={handleShippingSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Nom complet *"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Email *"
                                            type="email"
                                            value={shippingAddress.email}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Téléphone *"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Adresse *"
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input
                                            label="Ville *"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Code postal"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        />
                                        <Input
                                            label="Pays"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            disabled
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Continuer vers le paiement
                                    </Button>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-6">
                                    <CreditCard className="w-6 h-6 text-orange-500 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">Mode de paiement</h2>
                                </div>

                                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash_on_delivery"
                                                checked={paymentMethod.type === 'cash_on_delivery'}
                                                onChange={(e) => setPaymentMethod({ type: e.target.value as PaymentMethod['type'] })}
                                                className="mr-3"
                                            />
                                            <div>
                                                <div className="font-medium">Paiement à la livraison</div>
                                                <div className="text-sm text-gray-500">Payez en espèces lors de la réception</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="bank_transfer"
                                                checked={paymentMethod.type === 'bank_transfer'}
                                                onChange={(e) => setPaymentMethod({ type: e.target.value as PaymentMethod['type'] })}
                                                className="mr-3"
                                            />
                                            <div>
                                                <div className="font-medium">Virement bancaire</div>
                                                <div className="text-sm text-gray-500">Effectuer un virement vers notre compte</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="flex-1"
                                        >
                                            Retour
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            Confirmer la commande
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-6">
                                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">Confirmation de commande</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Shipping Address Summary */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Adresse de livraison</h3>
                                        <div className="text-sm text-gray-600">
                                            <p>{shippingAddress.fullName}</p>
                                            <p>{shippingAddress.address}</p>
                                            <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                                            <p>{shippingAddress.country}</p>
                                            <p>Tél: {shippingAddress.phone}</p>
                                            <p>Email: {shippingAddress.email}</p>
                                        </div>
                                    </div>

                                    {/* Payment Method Summary */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Mode de paiement</h3>
                                        <p className="text-sm text-gray-600">
                                            {paymentMethod.type === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Virement bancaire'}
                                        </p>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                            className="flex-1"
                                        >
                                            Retour
                                        </Button>
                                        <Button
                                            onClick={handleOrderConfirmation}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            {loading ? 'Création...' : 'Confirmer et commander'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé de commande</h3>

                            <div className="space-y-3 mb-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <img
                                            src={item.product.images[0] || '/placeholder-book.jpg'}
                                            alt={item.product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qté: {item.quantity} × {formatPrice(item.product.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Livraison</span>
                                    <span>Gratuite</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-orange-600">{formatPrice(getCartTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
