import React from "react";

declare global {

  type InputChange = React.ChangeEvent<HTMLInputElement>;
  type FormSubmit = React.FormEvent<HTMLFormElement>;

  interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    image_url?: string;
    role: "user" | "admin";
    created_at: Date;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }

  interface AuthState {
    error?: {
      issues?: { message: string }[];
      message?: string;
    };
  }

  type AuthAction = (
    prevState: AuthState | undefined,
    formData: FormData
  ) => Promise<AuthState>;

  interface Category {
    id: number;
    name: string;
    description: string;
  }

  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: number;
    image_url: string;
    created_at: Date;
    updated_at: Date;
    // Extra fields from join
    category_name?: string;
  }

  interface CartItem {
    productId: number;
    quantity: number;
  }
  
  interface fullCartItem { 
    productId: number; 
    quantity: number; 
    priceAtPurchase: number 
  }

  interface Address {
    id: number;    
    street: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
    phone: string;
    shortname: string;
  }  

  interface AddressActionState {
    success: boolean;
    error?: string;
    address?: Address;
  }

  interface DeleteAddressState {
    success: boolean;
    error?: string;
    deletedId?: number;
  }

  interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number | string;
    product_name: string;
    product_image: string;
  }

  interface Order {
    id: number;
    user_id: number;
    order_date: Date;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total_amount: number | string;
    shipping_address_id: number;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    shortname: string;
    address_phone: string;
    items: OrderItem[];
  }
}


