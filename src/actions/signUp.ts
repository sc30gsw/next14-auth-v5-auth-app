'use server'

import { prisma } from '@/lib/db'
import { handleError } from '@/lib/utils'
import { ActionsResult } from '@/types/ActionResult'
import { SignUpFormInput, signUpSchema } from '@/types/schemas/signUpSchema'
import bcrypt from 'bcrypt'

export const signUp = async (data: SignUpFormInput): Promise<ActionsResult> => {
  const result = signUpSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: {
        message: result.error.message,
      },
    }
  }

  const { nickname, email, password } = result.data

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('🚀 ~ signUp ~ hashedPassword:', hashedPassword)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    console.log('🚀 ~ signUp ~ existingUser:', existingUser)

    if (existingUser) {
      return {
        isSuccess: false,
        error: {
          message: 'このメールアドレスは既に登録されています。',
        },
      }
    }

    const user = await prisma.user.create({
      data: { name: nickname, email, password: hashedPassword },
    })
    console.log('🚀 ~ signUp ~ user:', user)

    return {
      isSuccess: true,
      message: 'サインアップに成功しました',
    }
  } catch (err) {
    handleError(err)

    return {
      isSuccess: false,
      error: {
        message: 'サインアップに失敗しました。',
      },
    }
  }
}
