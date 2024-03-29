'use server'

import { prisma } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { handleError } from '@/lib/utils'
import { ActionsResult } from '@/types/ActionResult'
import { SignUpFormInput, signUpSchema } from '@/types/schemas/signUpSchema'
import bcrypt from 'bcryptjs'

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

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return {
        isSuccess: false,
        error: {
          message: 'このメールアドレスは既に登録されています。',
        },
      }
    }

    await prisma.user.create({
      data: { name: nickname, email, password: hashedPassword },
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return {
      isSuccess: true,
      message: '確認メールを送信しました',
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
