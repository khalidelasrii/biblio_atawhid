import React, { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { Product, PRODUCT_CATEGORIES } from '../types';
import { ProductService } from '../services/dataService';
import toast from 'react-hot-toast';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useSimpleCart();

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    ...PRODUCT_CATEGORIES.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getActiveProducts();
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

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product);
      toast.success(`${product.name} ajouté au panier`);
    } catch (error: any) {
      console.error('Erreur ajout panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h1>
          <p className="text-gray-600">
            Découvrez notre large gamme de produits pour tous vos besoins scolaires et professionnels
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode d'affichage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affichage
              </label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            {selectedCategory !== 'all' && (
              <span> dans la catégorie "{categories.find(c => c.id === selectedCategory)?.name}"</span>
            )}
          </p>
        </div>

        {/* Liste des produits */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucun produit disponible pour le moment'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div key={product.id} className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm' : ''}>
                {viewMode === 'grid' ? (
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ) : (
                  // Vue liste
                  <div className="flex p-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mr-6 flex-shrink-0">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23f3f4f6"/><text x="64" y="64" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="12">Image non disponible</text></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Aucune image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <span className="text-2xl font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {categories.find(c => c.id === product.category)?.name}
                          </span>
                        </div>
                        <Button onClick={() => handleAddToCart(product)}>
                          Ajouter au panier
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
