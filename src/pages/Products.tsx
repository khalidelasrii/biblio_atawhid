import React, { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'livres', name: 'Livres scolaires' },
    { id: 'fournitures', name: 'Fournitures scolaires' },
    { id: 'impression', name: 'Services d\'impression' },
    { id: 'papeterie', name: 'Papeterie' },
    { id: 'sacs', name: 'Sacs à dos' }
  ];

  // Mock data - remplacer par un appel Firebase
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Manuel de Mathématiques - 1ère Année',
      description: 'Manuel complet de mathématiques pour la première année du baccalauréat.',
      price: 85,
      images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'],
      category: 'livres',
      stock: 15,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Set de Géométrie Complet',
      description: 'Kit complet avec règle, équerre, compas et rapporteur.',
      price: 35,
      images: ['https://images.pexels.com/photos/7092/cadette-girl-school-equipment.jpg'],
      category: 'fournitures',
      stock: 25,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Impression couleur A4',
      description: 'Service d\'impression couleur haute qualité sur papier A4.',
      price: 2,
      images: ['https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'],
      category: 'impression',
      stock: 100,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Cahier 200 pages',
      description: 'Cahier de qualité supérieure avec couverture rigide.',
      price: 12,
      images: ['https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'],
      category: 'papeterie',
      stock: 50,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const handleViewDetails = (product: Product) => {
    console.log('View details:', product);
    // TODO: Implémenter la vue détaillée du produit
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Nos Produits
        </h1>
        <p className="text-lg text-gray-600">
          Découvrez notre large gamme de produits pour tous vos besoins
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};