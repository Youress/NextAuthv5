import prisma from "@/prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Make sure you have bcryptjs installed for password comparison

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password:{},
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
            email: string;
            password: string;
          };

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        // If no user is found or password doesn't match, return null
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid email or password");
        }

        // If everything is fine, return the user object
        return {
            id: user.id.toString(),
            email : user.email
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page path (optional)
  },
});
