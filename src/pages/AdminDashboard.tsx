import { useState, useEffect } from 'react';
import {
    Package,
    MessageSquare,
    TrendingUp,
    Plus,
    Bell,
    LogOut,
    Eye,
    ShoppingBag,
    Download,
    Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProductService, MessageService } from '../services/dataService';
import { OrderService, OrderData } from '../services/orderService';
import { Product, Message } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import ProductList from '../components/admin/ProductList';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const { currentUser, signOut } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'messages' | 'orders'>('overview');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, messagesData, ordersData, unreadCountData] = await Promise.all([
                ProductService.getAllProducts(),
                MessageService.getAllMessages(),
                OrderService.getAllOrders(),
                MessageService.getUnreadCount()
            ]);

            setProducts(productsData);
            setMessages(messagesData);
            setOrders(ordersData);
            setUnreadCount(unreadCountData);
        } catch (error: any) {
            console.error('Erreur chargement données:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Déconnexion réussie');
        } catch (error: any) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            await MessageService.markAsRead(messageId);
            toast.success('Message marqué comme lu');
            loadData(); // Recharger les données
        } catch (error: any) {
            toast.error('Erreur lors du marquage du message');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderData['currentStatus']) => {
        try {
            await OrderService.updateOrderStatus(orderId, newStatus);
            toast.success('Statut de la commande mis à jour');
            loadData(); // Recharger les données
        } catch (error: any) {
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    const handleDownloadOrderPDF = async (orderId: string, orderNumber: string) => {
        try {
            await OrderService.downloadOrderPDF(orderId, orderNumber);
            toast.success('PDF téléchargé avec succès');
        } catch (error: any) {
            toast.error('Erreur lors du téléchargement du PDF');
        }
    };

    const stats = [
        {
            title: 'Produits total',
            value: products.length,
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            title: 'Produits actifs',
            value: products.filter(p => p.isActive).length,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Commandes total',
            value: orders.length,
            icon: ShoppingBag,
            color: 'bg-purple-500'
        },
        {
            title: 'Messages total',
            value: messages.length,
            icon: MessageSquare,
            color: 'bg-orange-500'
        },
        {
            title: 'Messages non lus',
            value: unreadCount,
            icon: Bell,
            color: 'bg-red-500'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Administration - Biblio Al-Tawhid
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Bienvenue, {currentUser?.displayName}
                            </span>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
                            { id: 'products', label: 'Produits', icon: Package },
                            { id: 'orders', label: 'Commandes', icon: ShoppingBag },
                            { id: 'messages', label: 'Messages', icon: MessageSquare }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                {tab.id === 'messages' && unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Contenu principal */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'overview' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <Card key={index} className="p-6">
                                    <div className="flex items-center">
                                        <div className={`${stat.color} rounded-md p-3`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Actions rapides */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setActiveTab('products')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Ajouter un produit
                                    </Button>
                                    <Button
                                        onClick={() => setActiveTab('messages')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Voir les messages
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Messages récents</h3>
                                <div className="space-y-3">
                                    {messages.slice(0, 3).map((message) => (
                                        <div key={message.id} className="border-l-4 border-orange-500 pl-4">
                                            <p className="text-sm font-medium text-gray-900">{message.name}</p>
                                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                                            <p className="text-xs text-gray-500">
                                                {message.createdAt.toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <p className="text-sm text-gray-500">Aucun message</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="px-4 py-6 sm:px-0">
                        <ProductList />
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Messages ({messages.length})
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {messages.map((message) => (
                                        <li key={message.id} className={`${!message.isRead ? 'bg-blue-50' : ''}`}>
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-3 h-3 rounded-full ${!message.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{message.name}</p>
                                                            <p className="text-sm text-gray-500">{message.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500">
                                                            {message.createdAt.toLocaleDateString()}
                                                        </span>
                                                        {!message.isRead && (
                                                            <Button
                                                                onClick={() => handleMarkAsRead(message.id)}
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                                                    {message.phone && (
                                                        <p className="text-sm text-gray-500 mt-1">Téléphone: {message.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {messages.length === 0 && (
                                    <div className="text-center py-12">
                                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun message</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Les messages de contact apparaîtront ici.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Commandes ({orders.length})
                            </h2>

                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id} className="p-6">
                                        <div className="space-y-4">
                                            {/* En-tête de commande */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Commande #{order.orderNumber}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Créée le {order.createdAt.toLocaleDateString()} à {order.createdAt.toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xl font-bold text-orange-600">
                                                        {order.totalAmount} DH
                                                    </span>
                                                    <Button
                                                        onClick={() => order.id && handleDownloadOrderPDF(order.id, order.orderNumber)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>PDF</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Informations client */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Informations client</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Nom: <span className="font-medium text-gray-900">{order.customerInfo.name}</span></p>
                                                        <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{order.customerInfo.email}</span></p>
                                                        <p className="text-sm text-gray-600">Téléphone: <span className="font-medium text-gray-900">{order.customerInfo.phone}</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Adresse:</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.shippingAddress.address}<br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                                            {order.shippingAddress.country}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Articles commandés */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Articles commandés</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={item.product.images?.[0] || '/placeholder-book.jpg'}
                                                                    alt={item.product.name}
                                                                    className="w-12 h-12 object-cover rounded border"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{item.product.name}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Quantité: {item.quantity} × {item.price} DH
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="font-medium text-gray-900">
                                                                {(item.quantity * item.price).toFixed(2)} DH
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Paiement et statut */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Méthode de paiement:</p>
                                                    <p className="font-medium text-gray-900">
                                                        {order.paymentMethod.type === 'cash_on_delivery' ? 'Paiement à la livraison' : order.paymentMethod.type}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <label className="text-sm font-medium text-gray-700">Statut:</label>
                                                    <select
                                                        value={order.currentStatus}
                                                        onChange={(e) => order.id && handleUpdateOrderStatus(order.id, e.target.value as OrderData['currentStatus'])}
                                                        className="border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                                                    >
                                                        <option value="pending">En attente</option>
                                                        <option value="confirmed">Confirmée</option>
                                                        <option value="processing">En préparation</option>
                                                        <option value="shipped">Expédiée</option>
                                                        <option value="delivered">Livrée</option>
                                                        <option value="cancelled">Annulée</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            {order.notes && (
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <h5 className="text-sm font-medium text-blue-900 mb-1">Notes de commande:</h5>
                                                    <p className="text-sm text-blue-800">{order.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}

                                {orders.length === 0 && (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Les commandes apparaîtront ici.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
