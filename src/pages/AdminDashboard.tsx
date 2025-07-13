import { useState, useEffect } from 'react';
import {
    Package,
    MessageSquare,
    TrendingUp,
    Plus,
    Bell,
    LogOut,
    Eye,
    ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProductService, MessageService } from '../services/dataService';
import { CartService } from '../services/cartService';
import { Product, Message, Order } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const { currentUser, signOut } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
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
                CartService.getAllOrders(),
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

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['currentStatus']) => {
        try {
            await CartService.updateOrderStatus(orderId, newStatus);
            toast.success('Statut de la commande mis à jour');
            loadData(); // Recharger les données
        } catch (error: any) {
            toast.error('Erreur lors de la mise à jour du statut');
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un produit
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Catégorie
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prix
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.price} DH
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.stock}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.isActive ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {products.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Aucun produit trouvé</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="px-4 py-6 sm:px-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages de contact</h2>

                        <Card>
                            <div className="divide-y divide-gray-200">
                                {messages.map((message) => (
                                    <div key={message.id} className={`p-6 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                                                    {!message.isRead && (
                                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">{message.name}</span> - {message.email}
                                                    {message.phone && <span> - {message.phone}</span>}
                                                </div>
                                                <p className="text-gray-700 mb-3">{message.message}</p>
                                                <p className="text-xs text-gray-500">
                                                    {message.createdAt.toLocaleDateString()} à {message.createdAt.toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                {!message.isRead && (
                                                    <Button
                                                        onClick={() => handleMarkAsRead(message.id)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Marquer comme lu
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Aucun message trouvé</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="px-4 py-6 sm:px-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des commandes</h2>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Numéro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                                                        <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.totalAmount} {order.currency}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.currentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.currentStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                order.currentStatus === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                                    order.currentStatus === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                        order.currentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.currentStatus === 'pending' ? 'En attente' :
                                                            order.currentStatus === 'confirmed' ? 'Confirmé' :
                                                                order.currentStatus === 'processing' ? 'En traitement' :
                                                                    order.currentStatus === 'shipped' ? 'Expédié' :
                                                                        order.currentStatus === 'delivered' ? 'Livré' :
                                                                            'Annulé'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {order.currentStatus === 'pending' && (
                                                            <Button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                                                size="sm"
                                                                className="bg-blue-500 hover:bg-blue-600"
                                                            >
                                                                Confirmer
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orders.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Aucune commande trouvée</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
