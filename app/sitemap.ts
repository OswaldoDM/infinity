import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/database/repositories/products.repository'

/*
sitemap.ts: Es un mapa para Google.

¿Qué hace?

Lista todas las páginas públicas de tu tienda (Home, Carrito y cada Producto).

¿Por qué es necesario?

Sin esto, Google no sabría qué páginas existen en tu sitio.
Al crear una cuenta nueva en Google Search Console, este archivo ayuda a Google 
a indexar tu tienda automáticamente y mucho más rápido.

Si en el futuro creas una página nueva solo necesitas agregarla aquí y Google 
la encontrará sola.
*/
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://infinity-theta-gules.vercel.app'
  
  // Public static routes
  const staticRoutes = [
    '',
    '/cart',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Dynamic product routes
  const products = await getProducts()
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
