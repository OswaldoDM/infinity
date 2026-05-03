import { MetadataRoute } from 'next';

/*
robots.ts: Le dice a Google qué partes de tu web rastrear.

Ahora está programado para:

✅ Entrar a TODO el sitio web (usando /).
✅ NO entrar a las carpetas protegidas (/admin-dashboard/, /api/).
✅ Conocer la dirección del sitemap para indexar todo correctamente.
*/
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard/', '/api/'],
    },
    sitemap: 'https://infinity-theta-gules.vercel.app/sitemap.xml',
  }
}
