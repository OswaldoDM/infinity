import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  /*
  el objeto pages define que Auth.js no usará SU página 
  de login por defecto, sino que va redirigir a TU página 
  personalizada en /login cuando sea necesario autenticarse.
  */
  pages: {
    signIn: "/login",
  },
  callbacks: {    
    // AUTORIZACIÓN DE RUTAS
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // true or false

      const isProtectedRoute =        
        nextUrl.pathname.startsWith("/profile") || 
        nextUrl.pathname.startsWith("/admin-dashboard") ||
        nextUrl.pathname.startsWith("/payment"); 

      const isAuthRoute = 
        nextUrl.pathname.startsWith("/login") || 
        nextUrl.pathname.startsWith("/register");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
    // SESSION    
    /*
    Cuando el frontend pide la sesión, lee el token y 
    transfiere el id, role, username, imagen y datos del usuario al objeto session.user. 
    Esto te permite acceder a session.user en tus componentes.
    */
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.username && session.user) {
        session.user.username = token.username as string;
      }           
      if (token.picture && session.user) {
        session.user.image = token.picture as string;
      }      
      if (session.user) {
        session.user.first_name = token.first_name as string | undefined;
        session.user.last_name = token.last_name as string | undefined;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
    // TOKEN    
    // Cuando el usuario hace login, captura los datos y los guarda en el token cifrado.    
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.phone = user.phone;
      }
      // Cuando llamamos a `update()` en el cliente, actualizamos el token
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      }
      return token;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
