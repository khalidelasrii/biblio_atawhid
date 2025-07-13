import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Order } from '../types';
import { Button } from '../components/ui/Button';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order as Order;

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h2>
                    <Button onClick={() => navigate('/')}>
                        Retour à l'accueil
                    </Button>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Commande confirmée !
                    </h1>
                    <p className="text-gray-600">
                        Merci pour votre commande. Nous vous contacterons bientôt pour confirmer la livraison.
                    </p>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <Package className="w-6 h-6 text-orange-500 mr-2" />
                        <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-900">Numéro de commande:</span>
                                <p className="text-gray-600">{order.orderNumber}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">Date:</span>
                                <p className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="font-medium text-gray-900">Statut:</span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                En attente
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Informations de livraison</h3>
                    <div className="text-sm space-y-1">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                        <p>Tél: {order.shippingAddress.phone}</p>
                        <p>Email: {order.shippingAddress.email}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Articles commandés</h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <div>
                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                            <span>Total</span>
                            <span className="text-orange-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Mode de paiement</h3>
                    <p className="text-gray-600">
                        {order.paymentMethod.type === 'cash_on_delivery'
                            ? 'Paiement à la livraison'
                            : 'Virement bancaire'}
                    </p>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">Prochaines étapes</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>Nous allons traiter votre commande dans les plus brefs délais</span>
                        </li>
                        <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>Vous recevrez un email de confirmation avec les détails de livraison</span>
                        </li>
                        <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>Nous vous contacterons par téléphone pour confirmer l'adresse de livraison</span>
                        </li>
                        <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>La livraison sera effectuée sous 2-5 jours ouvrables</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="flex-1 flex items-center justify-center"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                    <Button
                        onClick={() => navigate('/products')}
                        className="flex-1 flex items-center justify-center"
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Continuer les achats
                    </Button>
                </div>

                {/* Contact Info */}
                <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Une question sur votre commande ?
                        <a href="/contact" className="text-orange-600 hover:underline ml-1">
                            Contactez-nous
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
