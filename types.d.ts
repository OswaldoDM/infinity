import React from "react";
import { DefaultSession } from "next-auth";

declare global {

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

  type InputChange = React.ChangeEvent<HTMLInputElement>;
  type FormSubmit = React.FormEvent<HTMLFormElement>;

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

  interface Item { 
    productId: number; 
    quantity: number; 
    priceAtPurchase: number 
  }
  
}

// Extiende los tipos de NextAuth para incluir campos custom en la sesión
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
}
