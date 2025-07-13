// Types principaux pour l'application
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'client';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // URLs des images (max 3)
  category: string;
  subcategory?: string;
  stock: number;
  isActive: boolean;
  tags?: string[]; // Mots-clés pour la recherche
  weight?: number; // Pour les frais de livraison
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string; // Numéro de commande unique
  userId?: string; // null si commande anonyme
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  statusHistory: OrderStatus[];
  currentStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  documents?: string[];
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  icon?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceType: string;
  isVisible: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

// Types pour le panier e-commerce
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>; // Pour les options comme couleur, taille, etc.
}

export interface Cart {
  id: string;
  userId?: string; // null si panier anonyme
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'cash_on_delivery' | 'bank_transfer' | 'card';
  details?: Record<string, any>;
}

export interface OrderStatus {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  note?: string;
}

// Constantes pour les catégories
export const PRODUCT_CATEGORIES = [
  {
    id: 'livres',
    name: 'Livres',
    description: 'Manuels scolaires, littérature, académiques',
    subcategories: ['manuels-scolaires', 'litterature', 'academiques', 'dictionnaires', 'romans']
  },
  {
    id: 'fournitures',
    name: 'Fournitures Scolaires',
    description: 'Cahiers, stylos, matériel scolaire',
    subcategories: ['cahiers-carnets', 'stylos-crayons', 'sacs-dos', 'materiel-dessin', 'calculatrices']
  },
  {
    id: 'papeterie',
    name: 'Papeterie',
    description: 'Fournitures de bureau et administratives',
    subcategories: ['classeurs-chemises', 'papier-enveloppes', 'accessoires-bureau', 'tampons-cachets']
  },
  {
    id: 'impression',
    name: 'Services d\'Impression',
    description: 'Photocopies, impression, reliure',
    subcategories: ['photocopies', 'impression-couleur', 'reliure', 'plastification']
  }
] as const;

export type ProductCategoryId = typeof PRODUCT_CATEGORIES[number]['id'];