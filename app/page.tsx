import { getCategories } from "@/lib/database/repositories/categories.repository";
import { getProducts } from "@/lib/database/repositories/products.repository";
import Products from "./ui/Products";

async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <div className="text-center pb-6">
        <h1 className="text-red-500">Live without Limits</h1>
        <p className="mt-2 text-gray_secondary font-inter">
          Explore a world of endless possibilities
        </p>
        {/* <p className="text-center mt-3">Sponsored by STRIPE</p> */}
      </div>            
      <Products categories={categories} products={products} />      
    </>
  );
}

export default Home;
