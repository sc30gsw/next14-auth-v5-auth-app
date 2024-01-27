'use server'

import { prisma } from '@/lib/db'
import { ActionsResult } from '@/types/ActionResult'

export const newVerification = async (
  token: string,
): Promise<ActionsResult> => {
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return {
      isSuccess: false,
      error: { message: 'トークンが見つかりませんでした。' },
    }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
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

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  })

  await prisma.verificationToken.delete({ where: { id: existingToken.id } })

  return {
    isSuccess: true,
    message: 'メールアドレスの認証が完了しました。',
  }
}
