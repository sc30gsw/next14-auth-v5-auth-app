import { prisma } from '@/lib/db'
import { signInSchema } from '@/types/schemas/signInSchema'
import bcrypt from 'bcrypt'
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
  providers: [
    // TODO: Google,Github認証を追加する

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
