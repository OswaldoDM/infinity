import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

/*
  Por defecto, Auth.js define User y Session
  con campos básicos.

  En este archivo, extendemos esas interfaces
  para agregar campos personalizados.

  En auth.config.ts se usan los tipos extendidos 
  en async jwt y async session
*/

// declare module "next-auth" {

//   interface Session {
//     user: {
//       id: string;
//       username: string;
//       role: string;
//     } & DefaultSession["user"]
//   }

//   interface User {
//     role: string;
//     username: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role: string;
//     username: string;
//   }
// }


declare module "next-auth" {
  
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
}