"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { authenticator } from "otplib";

export const get2faSecret = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id),
    },
  });

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  let twoFactorSecret = user.TwoFactorAuthSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await prisma.user.update({
      where: {
        id: parseInt(session.user.id),
      },
      data: {
        TwoFactorAuthSecret: twoFactorSecret,
      },
    });
  }
  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email ?? " ",
      "web dev",
      twoFactorSecret
    ),
  };
};
