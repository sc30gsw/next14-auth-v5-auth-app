import { prisma } from '@/lib/db'
import { signInSchema } from '@/types/schemas/signInSchema'
import bcrypt from 'bcryptjs'
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
            return null
          }

          if (!user.password) {
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password,
          )

          if (isPasswordCorrect) {
            return user
          }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
