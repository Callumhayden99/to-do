import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../prismaClient"; // Adjust the import path as needed

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
      
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { id: user.id, name: user.name, email: user.email };
          }
          // Optionally, log or handle the failure case more explicitly here
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          // Depending on your error handling strategy, you might want to throw the error or return null
          throw new Error('An error occurred during authorization.');
        }
      }
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // If user object exists, include user details in JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Assign user details from JWT to session
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/auth/signin",
  },
});