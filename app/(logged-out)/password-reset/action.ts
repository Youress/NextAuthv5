"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { randomBytes } from "crypto";

export const passwordReset = async (emailAddress: string) => {
  const session = await auth();

  // If the user is already logged in
  if (session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }

  // Find the user with the provided email address
  const user = await prisma.user.findUnique({
    where: {
      email: emailAddress,
    },
  });

  // If the user is not found
  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  // Generate a new password reset token and set expiration
  const passwordResetToken = randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 3600000); // 1 hour expiration

  // Check if a reset token already exists for this user
  const existingToken = await prisma.token.findUnique({
    where: {
      userId: user.id,
    },
  });

  // If token exists, update the existing token
  if (existingToken) {
    await prisma.token.update({
      where: {
        userId: user.id,
      },
      data: {
        token: passwordResetToken,
        expiration: expiration,
      },
    });

    return {
      success: true,
      message: "Password reset token updated. Please check your email.",
    };
  } else {
    // Otherwise, create a new token
    await prisma.token.create({
      data: {
        userId: user.id,
        token: passwordResetToken,
        expiration: expiration,
      },
    });

    return {
      success: true,
      message: "Password reset token created. Please check your email.",
    };
  }
};
