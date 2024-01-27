'use server'

import { prisma } from '@/lib/db'
import { sendPasswordRestEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ActionsResult } from '@/types/ActionResult'
import {
  PasswordResetFormInput,
  passwordResetSchema,
} from '@/types/schemas/passwordResetSchema'

export const resetPassword = async (
  data: PasswordResetFormInput,
): Promise<ActionsResult> => {
  const result = passwordResetSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: { message: result.error.message },
    }
  }

  const { email } = result.data

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (!existingUser) {
    return {
      isSuccess: false,
      error: { message: 'メールアドレスが見つかりませんでした。' },
    }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordRestEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  )

  return { isSuccess: true, message: 'メールを送信しました' }
}
