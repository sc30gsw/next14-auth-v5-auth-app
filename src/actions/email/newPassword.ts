'use server'

import { prisma } from '@/lib/db'
import { ActionsResult } from '@/types/ActionResult'
import {
  NewPasswordFormInput,
  newPasswordSchema,
} from '@/types/schemas/newPasswordSchema'
import bcrypt from 'bcryptjs'

export const newPassword = async (
  data: NewPasswordFormInput,
  token?: string | null,
): Promise<ActionsResult> => {
  if (!token) {
    return {
      isSuccess: false,
      error: { message: 'トークンが無効です。' },
    }
  }

  const result = newPasswordSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: { message: result.error.message },
    }
  }

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return {
      isSuccess: false,
      error: { message: 'トークンが無効です。' },
    }
  }

  const hasExpires = new Date(existingToken.expires) < new Date()

  if (hasExpires) {
    return {
      isSuccess: false,
      error: { message: 'トークンの有効期限が切れています。' },
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  })

  if (!existingUser) {
    return {
      isSuccess: false,
      error: { message: 'ユーザーが見つかりませんでした。' },
    }
  }

  const { password } = result.data
  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.delete({ where: { id: existingToken.id } })

  return {
    isSuccess: true,
    message: 'パスワードをリセットしました。',
  }
}
