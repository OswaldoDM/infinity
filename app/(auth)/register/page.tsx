"use client";
import { registerAction } from "@/app/actions/auth.actions";
import { useActionState } from "react";
import Link from "next/link";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";

function Register() {  
  const [state, action, isPending] = useActionState(registerAction, { error: undefined });  

  return (
    <div className="flex justify-center pt-5">
      <div className="">
        <h2 className="text-center mb-8">Register</h2>      
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
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <Button          
          type="submit"
          disabled={isPending}
        >
        {isPending ? (
          <div className="animate-spin rounded-full w-5 h-5 border-b-4 border-white"></div>
          ) : "Sign Up"}
        </Button>        
      </form>
      <p className="flex gap-x-2 justify-between mt-4">
        You already have an account?
        <Link href="/login" className="text-blue-800 font-semibold">
          Sign In
        </Link>
      </p>
      </div>           
    </div>    
  );
}

export default Register;