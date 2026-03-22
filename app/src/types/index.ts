export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cafe' | 'infusiones' | 'pasteleria' | 'cocina' | 'bebidas' | 'promos';
  subcategory?: string;
  isFeatured?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'equipamiento' | 'cafe-grano' | 'bebidas-botella' | 'accesorios' | 'merchandising';
  image: string;
  inStock: boolean;
  isFeatured?: boolean;
  crossSellIds?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
  avatar?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
