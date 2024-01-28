'use server'

import { prisma } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { ActionsResultWithData } from '@/types/ActionResult'
import { EditProfileFormInput } from '@/types/schemas/editProfileShema'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { auth, unstable_update as updateByAuthJs } from '../../auth'

export const editProfile = async (
  data: EditProfileFormInput,
): Promise<ActionsResultWithData<boolean>> => {
  const user = await auth().then((session) => session?.user)

  if (!user) {
    return {
      isSuccess: false,
      error: { message: '認証情報を取得できませんでした。' },
    }
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

  if (!dbUser) {
    return {
      isSuccess: false,
      error: { message: 'ユーザーが見つかりませんでした。' },
    }
  }

  if (user.isOauth) {
    data.email = undefined
    data.password = undefined
    data.newPassword = undefined
    data.isTwoFactorEnabled = undefined
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser && existingUser.id !== user.id) {
      return {
        isSuccess: false,
        error: { message: 'このメールアドレスは既に使用されています。' },
      }
    }

    const verificationToken = await generateVerificationToken(data.email)
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return {
      isSuccess: true,
      message:
        'メールアドレスが変更されました。新しいメールアドレスを確認してください。',
      data: { isOpenSheet: true },
    }
  }

  if (data.password && data.newPassword && dbUser.password) {
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      dbUser.password,
    )

    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: { message: 'パスワードが間違っています。' },
      }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12)
    data.password = hashedPassword
    data.newPassword = undefined
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: { ...data },
  })

  updateByAuthJs({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  })

  revalidatePath('/my-account')

  return {
    isSuccess: true,
    message: 'プロフィールを更新しました。',
    data: {
      isOpenSheet: false,
    },
  }
}
