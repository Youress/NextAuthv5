"use server";

import { auth } from "@/auth";
import { mailer } from "@/lib/email";
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
  const expiration = new Date(Date.now() + 3600000); // 1-hour expiration

  // Upsert the token in the database
  await prisma.token.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      token: passwordResetToken,
      expiration: expiration,
    },
    update: {
      token: passwordResetToken,
      expiration: expiration,
    },
  });

  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from : "web@youssefessouairi.website",
    subject : "Your password reset test",
    to : emailAddress,
    html : `hey , ${emailAddress}, You requested to reset your password.
here your link reset password, the link will expire in 1 hour. <a href=${resetLink}>Link</a>`,
  })

  return {
    success: true,
    message: "Password reset token created. Please check your email.",
  };
};
