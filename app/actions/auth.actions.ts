'use server';

import { signIn, signOut } from '@/auth';
import { createUser, findUserByEmail } from '@/lib/database/auth.repository';
import { registerSchema } from "@/lib/auth/schemas";
import { authErrorHandler } from '@/lib/auth/errorHandler';
import bcrypt from 'bcryptjs';

export const loginAction: AuthAction = async (state, formData) => {  
  try {
    await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' });
  } catch (error) {
    return authErrorHandler(error);
  }
  // si signIn no redirige, se retorna un objeto vacío
  return {};
}

export const registerAction: AuthAction = async (state, formData) => {
  try {
    const rawData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };    

    const { email, password, username } = registerSchema.parse(rawData);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { error: { message: "This email is already registered" } };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await createUser({
      username,
      email,
      password_hash: passwordHash
    });
    
    await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' }); // Login automático tras registro exitoso

  } catch (error) {
    return authErrorHandler(error);
  }
  // si signIn no redirige, se retorna un objeto vacío
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}