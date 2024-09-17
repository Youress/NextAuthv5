import prisma from "@/prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

//The useSession() hook provides access to the current user's Session object, as well as helpers for setting the active session.
export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({token, user}) {
            // Add the user ID to the JWT token when the user object exists (after login)
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
            // Make the user ID available in the session object
      session.user.id = token.id as string ;
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
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
          email: user.email,
        };
      },
    }),
  ],
});
