import { ZodError } from "zod";
import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";

export function authErrorHandler(error: unknown): AuthState {    
  
  unstable_rethrow(error);

  // Errores de Auth.js (Next-Auth)  
  if (error instanceof AuthError) {
    if (error.type === 'CredentialsSignin') {
      return {
        error: { message: "Wrong credentials. Please check your email and password." }
      };
    }
    // Cualquier otro error de Auth.js
    return {
      error: { message: "Authentication error. Please try again." }
    };
  }

  // Errores de validación de Zod
  if (error instanceof ZodError) {
    return {
      error: { 
        issues: error.issues,
        message: "Validation error"
      },
    };
  }

  // Errores generales (Error estándar o personalizados)
  if (error instanceof Error) {
    return {
      error: { message: error.message },
    };
  }

  // Errores totalmente desconocidos
  console.error("Unexpected server error:", error);
  return {
    error: { message: "Unexpected server error" },
  };
}
