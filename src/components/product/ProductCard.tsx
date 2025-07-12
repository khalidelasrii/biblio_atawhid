import React from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  return (
    <Card hover className="overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          {product.stock > 0 ? (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              En stock
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Épuisé
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-gray-800 border-white hover:bg-gray-100"
              onClick={() => onViewDetails?.(product)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {product.stock > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAddToCart?.(product)}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-medium text-orange-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {product.stock > 0 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart?.(product)}
              className="text-sm"
            >
              Ajouter
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="text-sm"
            >
              Épuisé
            </Button>
          )}
        </div>

        {/* Stock info */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            Plus que {product.stock} en stock
          </p>
        )}
      </div>
    </Card>
  );
};