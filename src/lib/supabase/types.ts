/**
 * Database schema types for Supabase.
 * These types match the SQL schema defined in supabase/schema.sql.
 */

export type UserRole = "buyer" | "seller" | "admin";
export type ProductStatus = "active" | "draft" | "out_of_stock";
export type StoreStatus = "active" | "suspended";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "uploaded" | "verified" | "rejected";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  email_verified: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_region: string;
  is_default: boolean;
  created_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  status: StoreStatus;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  status: ProductStatus;
  created_at: string;
  // Joined fields (optional)
  store?: Store;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  // Joined fields (optional)
  product?: Product;
}

export interface Order {
  id: string;
  buyer_id: string;
  store_id: string;
  address_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  // Joined fields (optional)
  store?: Store;
  items?: OrderItem[];
  address?: Address;
  payment_proofs?: PaymentProof[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
}

export interface PaymentProof {
  id: string;
  order_id: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

/**
 * Guest cart item stored in localStorage
 */
export interface GuestCartItem {
  product_id: string;
  quantity: number;
}
