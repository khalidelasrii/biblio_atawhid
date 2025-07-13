import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { ProductService } from '../../services/dataService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedCategory]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error: any) {
            console.error('Erreur chargement produits:', error);
            toast.error('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (product: Product) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
            try {
                await ProductService.deleteProduct(product.id);
                toast.success('Produit supprimé avec succès');
                loadProducts();
            } catch (error: any) {
                console.error('Erreur suppression produit:', error);
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const toggleProductStatus = async (product: Product) => {
        try {
            await ProductService.updateProduct(product.id, {
                isActive: !product.isActive
            });
            toast.success(`Produit ${!product.isActive ? 'activé' : 'désactivé'} avec succès`);
            loadProducts();
        } catch (error: any) {
            console.error('Erreur mise à jour statut:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const getCategoryName = (categoryId: string) => {
        const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header avec actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    Gestion des Produits ({products.length})
                </h2>
                <Button onClick={handleAdd} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un produit
                </Button>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Toutes les catégories</option>
                        {PRODUCT_CATEGORIES.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Liste des produits */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm || selectedCategory ? 'Aucun produit trouvé avec ces critères' : 'Aucun produit ajouté'}
                    </p>
                    {!searchTerm && !selectedCategory && (
                        <Button onClick={handleAdd} className="mt-4">
                            Ajouter votre premier produit
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Image du produit */}
                            <div className="h-48 bg-gray-200 relative">
                                {product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image non disponible</text></svg>';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span>Aucune image</span>
                                    </div>
                                )}

                                {/* Badge statut */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>

                                {/* Badge stock */}
                                {product.stock <= 5 && (
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Contenu */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {getCategoryName(product.category)}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {product.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-orange-600">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Stock: {product.stock}
                                    </span>
                                </div>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {product.tags.length > 3 && (
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                +{product.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Modifier
                                    </button>

                                    <button
                                        onClick={() => toggleProductStatus(product)}
                                        className={`px-3 py-2 rounded text-sm transition-colors flex items-center justify-center ${product.isActive
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Formulaire d'ajout/modification */}
            <ProductForm
                product={selectedProduct}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={loadProducts}
            />
        </div>
    );
};

export default ProductList;
