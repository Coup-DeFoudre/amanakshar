import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "./db"
import { adminRateLimiter } from "./rate-limit"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        const username = credentials.username as string
        const password = credentials.password as string
        
        // Rate limiting based on username to prevent brute-force attacks
        const rateLimitResult = adminRateLimiter.check(5, `login:${username}`)
        if (!rateLimitResult.success) {
          console.warn(`Rate limit exceeded for login attempt: ${username}`)
          return null
        }
        
        try {
          // Query the Admin table for the user
          const admin = await prisma.admin.findUnique({
            where: { username },
          })
          
          if (!admin) {
            return null
          }
          
          // Verify password using bcrypt
          const isValidPassword = await compare(password, admin.passwordHash)
          
          if (!isValidPassword) {
            return null
          }
          
          return {
            id: admin.id,
            name: admin.username,
            email: `${admin.username}@amanakshar.com`,
          }
        } catch (error) {
          console.error("Error during authentication:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
