'use client';
import { useEffect, useState } from 'react';

export function useCart(products: Product[]) {
   
   const [cart, setCart] = useState<CartItem[]>([]);

   useEffect(() => {
      const existingCart = localStorage.getItem('cart');
      if (existingCart) {
         try {
            const parsedCart = JSON.parse(existingCart);
            setCart(parsedCart);
         } catch (error) {
            console.error("Error parsing cart:", error);
         }
      }
   }, []);

   const fullCart = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
   });

   const totalCart = fullCart.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
   }, 0);

   const deleteProduct = (productId: number) => {
      const updatedCart = cart.filter((item) => item.productId !== productId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
   };

   const updateQuantity = (productId: number, newQuantity: number) => {
      if (newQuantity < 1) return;
      const updatedCart = cart.map(item =>
         item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
   };

   const clearCart = () => {
      setCart([]);
      localStorage.removeItem('cart');
   };

   return { cart, fullCart, totalCart, deleteProduct, updateQuantity, clearCart };
}
