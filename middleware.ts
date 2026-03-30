import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
/*
inicializa la instancia de autenticación utilizando el objeto de configuración (authConfig)
Este objeto contiene las reglas de quién tiene acceso a qué (la función authorized). 

En la versión 5 de Auth.js, la propiedad .auth devuelve una función que Next.js reconoce 
como un Middleware. Al hacer export default, le estás diciendo a Next.js: 
"Usa esta lógica para filtrar todas las peticiones que entren a la aplicación".
*/
export default NextAuth(authConfig).auth;

export const config = {
  /* Configura el matcher para que el middleware se ejecute en todas las rutas
  excepto estáticos y rutas internas de Next.js */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};


/*
Dato importante: Se usa authConfig (una versión ligera de la configuración) en lugar 
del archivo auth.ts porque los middlewares de Next.js corren en el Edge Runtime, el cual 
no permite ciertas librerías de base de datos que suelen estar en el archivo principal 
de configuración.
*/
