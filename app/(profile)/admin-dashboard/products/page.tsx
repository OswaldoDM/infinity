import { getProducts } from "@/lib/database/repositories/products.repository";
import { getCategories } from "@/lib/database/repositories/categories.repository";
import ProductsTable from "../components/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h2>Products</h2>
          <p className="text-gray_secondary font-inter mt-1">{products.length} products</p>
        </div>
      </div>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
