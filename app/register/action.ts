"use server";

import { passworMatchdSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";
import prisma from "@/prisma/client";
import { hash } from "bcryptjs";

export default async function registerUser(formData: FormData) {
  try {
    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("passwordConfirm") as string,
    };
    const newUserSchema = z
      .object({
        email: z.string().email(),
      })
      .and(passworMatchdSchema);

    const newUserValidation = newUserSchema.safeParse({ ...rawFormData });
    if (!newUserValidation.success) {
      return {
        error: true,
        message:
          newUserValidation.error.issues[0]?.message ?? "An error accured",
      };
    }

    const hashedPassword = await hash(rawFormData.password, 10);
    await prisma.user.create({
      data: {
        email: rawFormData.email,
        password: hashedPassword,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e:any) {
    if (e.code === "P2002")
      return {
        error: true,
        message: "An account is alreaddy registered with that email",
      };
    return {
      error: true,
      message: "An error accured",
    };
  }
}
