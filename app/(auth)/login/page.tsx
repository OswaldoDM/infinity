"use client";
import { loginAction } from "@/app/actions/auth.actions";
import { useActionState } from "react";
import Link from "next/link";
import Input from "@/app/ui/Input";
import Button from "@/app/ui/Button";

function Login() {
   const [state, action, isPending] = useActionState(loginAction, { error: undefined });

   return (
      <div className="flex justify-center pt-5">
         <div className="">
            <h2 className="text-center mb-8">Login</h2>
            {state.error && (
               <div className="bg-stone-100 w-[300px] border border-red-500 p-2 mb-4 text-center">
                  {state.error.issues
                     ? state.error.issues.map((issue) => issue.message).join(", ")
                     : state.error.message
                     || "Something went wrong. Please try again later."
                  }
               </div>
            )}
            <form action={action} className="flex flex-col gap-4 w-[300px]">
               <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  defaultValue="johndoe@gmail.com"
                  required
               />
               <Input
                  type="password"
                  name="password"
                  defaultValue="123456"
                  placeholder="Password"
                  required
               />
               <Button
                  type="submit"
                  disabled={isPending}
               >
                  {isPending ? (
                     <div className="animate-spin rounded-full w-5 h-5 border-b-4 border-white"></div>
                  ) : "Sign In"}
               </Button>
            </form>
            <p className="flex gap-x-2 justify-between mt-4">
               You don&apos;t have an account yet?
               <Link href="/register" className="text-blue-800 font-semibold">
                  Sign Up
               </Link>
            </p>
         </div>
      </div>
   );
}

export default Login;