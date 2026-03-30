'use client';
import { useState } from 'react';

interface Props {
   productId: number;
   stock: number;
}

function AddToCartButton({ productId, stock }: Props) {
   const [added, setAdded] = useState(false);   

   const handleAddToCart = () => {
      // 1. Evitar añadir si no hay stock
      if (stock <= 0) return;

      // 2. Obtener el carrito actual del localStorage
      const existingCart = localStorage.getItem('cart');
      let cart = [];
      
      if (existingCart) {
         try {
            cart = JSON.parse(existingCart); // pasar JSON a arreglo
         } catch (error) {
            console.log(error);
            cart = [];
         }
      }

      // 3. Buscar si el producto ya está en el carrito
      const itemIndex = cart.findIndex((item:CartItem) => item.productId === productId);

      // findIndex devuelve -1 si no encuentra el elemento
      if (itemIndex === -1) {
         cart.push({ productId, quantity: 1 }); // como no existe, lo agregamos con cantidad 1
      } else {
         cart[itemIndex].quantity += 1; // Si existe, aumentamos su cantidad
      }      

      // 4. Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Feedback visual para el usuario
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);      
   };

   return (
      <button
         onClick={handleAddToCart}
         disabled={stock <= 0}
         className={`px-8 py-4 flex justify-center items-center gap-2 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all duration-300 w-full sm:w-auto 
         ${ added ? 'bg-green-600 text-white border-green-600' : 'bg-black text-white' }`                
         }
      >
         <span>{added ? '✔ Added to cart' : 'Add to Cart' }</span>
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M20 2.5H3.535L3.5 2.2075C3.42837 1.59951 3.13615 1.03894 2.67874 0.632065C2.22133 0.225186 1.63052 0.000284828 1.01833 0L0 0V1.66667H1.01833C1.22244 1.66669 1.41945 1.74163 1.57198 1.87726C1.72451 2.0129 1.82195 2.19979 1.84583 2.4025L3.16667 13.6258C3.23829 14.2338 3.53051 14.7944 3.98792 15.2013C4.44534 15.6081 5.03614 15.833 5.64833 15.8333H16.6667V14.1667H5.64833C5.44409 14.1666 5.24699 14.0916 5.09444 13.9558C4.94189 13.82 4.84452 13.6329 4.82083 13.43L4.71167 12.5H18.1967L20 2.5ZM16.8033 10.8333H4.51583L3.73167 4.16667H18.0058L16.8033 10.8333Z" />
            <path fill="#ffffff"d="M5.83347 20.0005C6.75395 20.0005 7.50014 19.2543 7.50014 18.3339C7.50014 17.4134 6.75395 16.6672 5.83347 16.6672C4.913 16.6672 4.16681 17.4134 4.16681 18.3339C4.16681 19.2543 4.913 20.0005 5.83347 20.0005Z" />
            <path fill="#ffffff"d="M14.1667 20.0005C15.0871 20.0005 15.8333 19.2543 15.8333 18.3339C15.8333 17.4134 15.0871 16.6672 14.1667 16.6672C13.2462 16.6672 12.5 17.4134 12.5 18.3339C12.5 19.2543 13.2462 20.0005 14.1667 20.0005Z" />
         </svg>
      </button>
   );
}


export default AddToCartButton;