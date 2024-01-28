'use server'

import { prisma } from '@/lib/db'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { ActionsResultWithData } from '@/types/ActionResult'
import { SignInFormInput, signInSchema } from '@/types/schemas/signInSchema'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { signIn as NextAuthSignIn } from '../../auth'
import { DEFAULT_LOGIN_REDIRECT } from '../../routes'

export const signIn = async (
  data: SignInFormInput,
): Promise<ActionsResultWithData<boolean>> => {
  const result = signInSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: {
        message: result.error.message,
      },
    }
  }

  const { email, password, code } = result.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  // biome-ignore lint/complexity/useSimplifiedLogicExpression: Because email is required for subsequent condition processing
  if (!existingUser || !existingUser.email) {
    return {
      isSuccess: false,
      error: { message: '入力されたメールアドレスは登録されていません。' },
    }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    )
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return {
      isSuccess: false,
      error: {
        message:
          'メールアドレスが確認されていません。メールアドレスを確認してください。',
      },
    }
  }

  if (existingUser.password) {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    )

    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: { message: 'メールアドレスまたはパスワードが間違っています。' },
      }
    }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await prisma.twoFactorToken.findFirst({
        where: { email: existingUser.email },
      })

      if (!twoFactorToken) {
        return {
          isSuccess: false,
          error: { message: '認証コードが間違っています。' },
        }
      }

      if (twoFactorToken.token !== code) {
        return {
          isSuccess: false,
          error: { message: '認証コードが間違っています。' },
        }
      }

      const hasExpires = new Date(twoFactorToken.expires) < new Date()

      if (hasExpires) {
        return {
          isSuccess: false,
          error: { message: '認証コードが期限切れです。' },
        }
      }

      await prisma.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

      const existingTwoFactorConfirmation =
        await prisma.twoFactorConfirmation.findUnique({
          where: { userId: existingUser.id },
        })

      if (existingTwoFactorConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingTwoFactorConfirmation.id },
        })
      }

      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return {
        isSuccess: true,
        message: '認証コードを送信しました。',
        data: {
          isTwoFactorEnabled: true,
        },
      }
    }
  }

  try {
    await NextAuthSignIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    return {
      isSuccess: true,
      message: 'ログインに成功しました。',
      data: {
        isTwoFactorEnabled: false,
      },
    }
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case 'CredentialsSignin':
          return {
            isSuccess: false,
            error: {
              message: 'メールアドレスまたはパスワードが間違っています。',
            },
          }
        default:
          return {
            isSuccess: false,
            error: {
              message: 'ログインに失敗しました。',
            },
          }
      }
    }

    throw err
  }
}
