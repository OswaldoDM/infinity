import { z } from "zod";

//const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ message: "Password is required" })
    // .regex(passwordRegex, {
    //   message:
    //     'Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    // }),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ message: "Password is required" }),
});

