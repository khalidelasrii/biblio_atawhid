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
  images: string[];
  category: string;
  subcategory?: string;
  stock: number;
  isActive: boolean;
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
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  documents?: string[];
  notes?: string;
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