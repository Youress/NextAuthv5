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
      "webdev",
      twoFactorSecret
    ),
  };
};

export const activate2fa = async (token: string) => {
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

  if (user.TwoFactorAuthSecret) {
    const tokenIsValid = authenticator.check(token, user.TwoFactorAuthSecret);
    if (!tokenIsValid) {
      return {
        error: true,
        message: "Invalid OTP",
      };
    }
    await prisma.user.update({
      where: {
        id: parseInt(session.user.id),
      },
      data: {
        TwoFactorAuthActivated: true,
      },
    });
  }
};

export const disabled2fa = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  await prisma.user.update({
    where: {
      id: parseInt(session.user.id),
    },
    data: {
      TwoFactorAuthActivated: false,
    },
  });
};
