"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { passworMatchdSchema } from "@/validation/passwordMatchSchema";
import { hash } from "bcryptjs";

interface Props {
  token: string;
  password: string;
  passwordConfirm: string;
}

export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: Props) => {
  try {
    // Validate password and confirmation
    const passwordValidation = passworMatchdSchema.safeParse({
      password,
      passwordConfirm,
    });

    if (!passwordValidation.success) {
      return {
        error: true,
        message: passwordValidation.error.issues[0].message ?? "An error occurred",
      };
    }

    const session = await auth();
    if (session?.user?.id) {
      return {
        error: true,
        message: "Already logged in. Please log out to reset your password.",
      };
    }

    // Validate token
    if (!token) {
      return {
        error: true,
        message: "Token is required for password reset.",
      };
    }

    const passwordToken = await prisma.token.findFirst({
      where: {
        token: token,
      },
    });

    if (!passwordToken) {
      return {
        error: true,
        message: "Invalid or expired token.",
        tokenInvalid: true,
      };
    }

    // Check token expiration
    const now = Date.now();
    if (now >= passwordToken.expiration.getTime()) {
      return {
        error: true,
        message: "Token has expired.",
        tokenInvalid: true,
      };
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: passwordToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Optionally, you might want to delete the token after successful password reset
    await prisma.token.delete({
      where: {
        userId : passwordToken.userId,
      },
    });

    return {
      success: true,
      message: "Password updated successfully.",
    };
  } catch (error) {
    return {
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};
