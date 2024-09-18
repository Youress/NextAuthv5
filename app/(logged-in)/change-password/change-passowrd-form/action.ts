"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { passworMatchdSchema } from "@/validation/passwordMatchSchema";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare,hash } from "bcryptjs";
import { z } from "zod";

interface Props {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}
export const changePassword = async ({
  currentPassword,
  password,
  passwordConfirm,
}: Props) => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password ",
    };
  }
  const formSchema = z
    .object({
      currentPassword: passwordSchema,
    })
    .and(passworMatchdSchema);
  const passwordValidationSchema = formSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });
  if (passwordValidationSchema?.error) {
    return {
      error: true,
      message:
        passwordValidationSchema?.error?.issues?.[0].message ??
        "An error occurred",
    };
  }
  const user = await prisma.user.findUnique({
    where : { id : parseInt(session.user.id)}
  }) 
  if(!user){
    return {
        error : true,
        message : "User not found"
    }
  }
  // Verify current password
  const isCurrentPasswordValid = await compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return {
      error: true,
      message: "Current password is incorrect",
    };
  }
  // Hash the new password
  const hashedPassword = await hash(password, 10);

  // Update the user's password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  return {
    error: false,
    message: "Password updated successfully",
  };
};
