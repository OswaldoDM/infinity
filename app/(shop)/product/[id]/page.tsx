import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/database/repositories/products.repository";
import AddToCartButton from "./components/AddToCartButton";
import ProductImage from "./components/ProductImage";
import BackToStoreBtn from "@/app/ui/components/BackToStoreBtn";

interface Props {
   params: Promise<{ id: string }>;
}

/*
Se genera la metadata del producto para que cada producto:
1. Se pueda indexar correctamente en Google
2. Se muestre correctamente en las redes sociales
3. Se muestre correctamente en los buscadores

Open Graph & Twitter: Si compartes el link del producto en WhatsApp, 
Slack o Twitter, ahora aparecerá automáticamente la imagen del producto, 
su nombre y su descripción en la previsualización.
*/

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const resolvedParams = await params;
   const productId = parseInt(resolvedParams.id, 10);
   const product = await getProductById(productId);

   if (!product) {
      return {
         title: "Product Not Found | Infinity",
      };
   }

   return {
      title: `${product.name} | Infinity`,
      description: product.description || `Discover ${product.name} at Infinity. Premium quality and visionary design.`,
      openGraph: {
         title: `${product.name} | Infinity`,
         description: product.description,
         images: [{ url: product.image_url }],
      },
      twitter: {
         card: "summary_large_image",
         title: `${product.name} | Infinity`,
         description: product.description,
         images: [product.image_url],
      },
   };
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

   /*
   Datos Estructurados JSON-LD:

   Se ha añadido un script invisible para el usuario pero muy valioso para Google que le indica:

   - Identidad: Que esta página es específicamente un producto (@type: Product).
   - Precio y Moneda: Le decimos exactamente cuánto cuesta (USD).
   - Stock: Le informamos si está disponible (InStock) o agotado (OutOfStock).
   - SKU: Generamos un identificador único para que Google no lo confunda con otros.

   Ahora, en lugar de ser un link azul cualquiera, Google tiene toda la información necesaria 
   para mostrar tu producto con Rich Snippets. Esto significa que los usuarios verán el precio 
   y si hay existencias directamente en la página de resultados de búsqueda, lo que aumenta 
   drásticamente la probabilidad de que hagan clic.
   
   */

   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image_url,
      description: product.description,
      sku: `product-${product.id}`,
      offers: {
         '@type': 'Offer',
         url: `https://infinity-theta-gules.vercel.app/product/${product.id}`,
         priceCurrency: 'USD',
         price: product.price,
         availability: product.stock_quantity > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
      },
   };

   return (
      <div className="flex-1 flex justify-center items-center">
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
         />
         <div className="max-w-6xl mx-auto">           
            <div className="flex flex-col lg:flex-row">               

               {/* Image Section */}               
               <div className="lg:w-[50%] flex justify-center items-center">
                  <ProductImage src={product.image_url} alt={product.name} />
               </div>

               {/* Content Section */}
               <div className="lg:w-[50%] flex flex-col justify-center">

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
