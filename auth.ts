import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "@/lib/database/repositories/auth.repository";
import { loginSchema } from "@/lib/auth/schemas";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await findUserByEmail(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordsMatch) return null;

        return {
          ...user,
          id: user.id.toString(),
          image: user.image_url,          
        };
      },
    }),
  ],
});
