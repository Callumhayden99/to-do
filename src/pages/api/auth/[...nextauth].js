import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '../../../../prismaClient' // Adjust the import path as needed
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: user.id, name: user.name, email: user.email }
        } else {
          // Return null if user data could not be retrieved
          return null
        }
      },
    }),
  ],
  // Add session and jwt callbacks as needed
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
        if (token?.id) {
            session.user.id = token.id;
        }
        return session;
    },
    jwt: async ({ token, user }) => {
        if (user) {
            token.id = user.id; // Ensure the user's ID is attached to the JWT token
        }
        return token;
    },
},
  // Define custom pages if needed
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    // other custom pages
  },
})