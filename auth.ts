import { prisma } from '@/lib/db'
import { JWT } from '@auth/core/jwt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import NextAuth, { Session } from 'next-auth'
import { authConfig } from './auth.config'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      })

      if (!existingUser) {
        return token
      }

      token.role = existingUser.role
      return token
    },
  },
  pages: { signIn: '/sign-in' },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
})
