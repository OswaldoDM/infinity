import { getCategories } from "@/lib/database/repositories/categories.repository";
import { getProducts } from "@/lib/database/repositories/products.repository";
import Products from "./ui/Products";

async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <div className="text-center pb-8 ">
        <h1 className="tracking-tight mb-4">Infinity</h1>
        <p className=" text-gray_secondary font-inter max-w-lg 2xl:max-w-xl mx-auto leading-relaxed">
          Explore a world of endless possibilities. Discover curated collections where premium quality 
          meets visionary design.
        </p>
      </div>            
      <Products categories={categories} products={products} />      
    </>
  );
}

export default Home;
