"use server";

import { signIn } from "@/auth";
import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";

export const loginWithCredential = async (
  {email,
  password}: { email: string; password: string }
) => {
  const loginSchema = z
    .object({
      email: z.string().email(),
      password:passwordSchema
    })
    
    const loginValidation = loginSchema.safeParse({
        email,
        password
    })
    if(!loginValidation.success){
        return{
            error:true,
            message: loginValidation.error.issues[0]?.message ?? "An error accured",
        }
    }
    try {
      await signIn("credentials",{
        email,
        password,
        redirect:false
      })
    } catch (error) {
      console.log(error)
    }
};
