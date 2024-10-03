"use server";

import { signIn } from "@/auth";
import prisma from "@/prisma/client";
import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";
import bcrypt from "bcryptjs";


export const loginWithCredential = async ({
  email,
  password,
  token
}: {
  email: string;
  password: string;
  token?: string
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });
  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0]?.message ?? "An error accured",
    };
  }
  try {
    await signIn("credentials", {
      email,
      password,
      token,
      redirect: false,
    });
  } catch (error) {
    return {
      error: true,
      message: "Incorrect email or password",
    };
  }
};
export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // If no user is found or password doesn't match, return null
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error : true,
      message : "Invalid email or password"
    }
  }

  return {
    TwoFactorAuthActivated : user.TwoFactorAuthActivated
  }
};
