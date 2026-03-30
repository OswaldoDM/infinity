import { getProducts } from '@/lib/database/products.repository';
import CartProducts from './components/CartProducts';

async function CartPage() {
   const products = await getProducts();
   
   return (
      <CartProducts products={products} />
   );
}

export default CartPage;
