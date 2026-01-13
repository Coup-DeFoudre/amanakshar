import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// Note: In production, this should query the database
// For now, using environment variables for simplicity
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        const username = credentials.username as string
        const password = credentials.password as string
        
        // Check against environment variables (simple auth for now)
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPassword = process.env.ADMIN_PASSWORD
        
        if (username !== adminUsername) {
          return null
        }
        
        // For simple setup, compare plain text
        // In production with DB, use bcrypt compare
        if (password !== adminPassword) {
          return null
        }
        
        return {
          id: "1",
          name: "Admin",
          email: "admin@amanakshar.com",
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

