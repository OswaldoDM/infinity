import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/database/products.repository";
import AddToCartButton from "./components/AddToCartButton";
import ProductImage from "./components/ProductImage";
import BackToStoreBtn from "@/app/ui/components/BackToStoreBtn";

interface Props {
   params: Promise<{ id: string }>;
}

async function ProductPage({ params }: Props) {
   const resolvedParams = await params;
   const productId = parseInt(resolvedParams.id, 10);

   if (isNaN(productId)) {
      notFound();
   }

   const product = await getProductById(productId);

   if (!product) {
      notFound();
   }

   return (
      <div className="flex-1 flex justify-center items-center">
         <div className="max-w-6xl mx-auto">           
            <div className="flex flex-col md:flex-row">               

               {/* Image Section */}               
               <div className="md:w-[50%] flex justify-center items-center">
                  <ProductImage src={product.image_url} alt={product.name} />
               </div>

               {/* Content Section */}
               <div className="md:w-[50%] flex flex-col justify-center">

                  <div className="inline-block px-3 py-1 rounded-full bg-white text-xs font-bold uppercase tracking-widest mb-6 w-max shadow-sm">
                     {product.category_name || "Uncategorized"}
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                     {product.name}
                  </h1>

                  {/* Divider */}
                  <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-600 to-blue-900 rounded-full mb-6"></div>

                  <p className=" text-slate-700 mb-5 leading-relaxed">
                     {product.description || "Detailed description coming soon. This premium product offers exceptional quality and design tailored for your lifestyle."}
                  </p>

                  <div className="flex items-center justify-between mb-10 bg-white rounded-xl">
                     <div className="flex flex-col py-3 px-4">
                        <span className=" text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Price</span>
                        <span className="text-xl font-black text-black_secondary">
                           ${Number(product.price)}
                        </span>
                     </div>
                     

                     <div className="flex flex-col py-3 px-4">
                        <span className=" text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Free Delivery</span>
                        <span className="text-xl font-bold text-black_secondary">
                           1-2 days
                        </span>
                     </div>

                     <div className="flex flex-col py-3 px-4">
                        <span className=" text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Guaranteed</span>
                        <span className="text-xl font-bold text-black_secondary">
                           1 year
                        </span>
                     </div>

                     <div className="flex flex-col py-3 px-4 ">
                        <span className="text-xs text-center text-slate-500 font-semibold uppercase tracking-wider mb-2">Availability</span>
                        <span className={`${product.stock_quantity > 0 ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-rose-700 bg-rose-100 border-rose-200'} border px-4 py-1.5 rounded-full font-bold shadow-sm`}>
                           {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                     </div>
                  </div>

                  <AddToCartButton productId={product.id} stock={product.stock_quantity} />
               </div>
            </div>            
            <BackToStoreBtn classname='mt-2'/>            
         </div>
      </div>
   );
}

export default ProductPage;
