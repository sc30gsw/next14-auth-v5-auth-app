'use server'

import { prisma } from '@/lib/db'
import { ActionsResult } from '@/types/ActionResult'
import { SignInFormInput, signInSchema } from '@/types/schemas/signInSchema'
import { AuthError } from 'next-auth'
import { signIn as NextAuthSignIn } from '../../auth'
import { DEFAULT_LOGIN_REDIRECT } from '../../routes'

export const signIn = async (data: SignInFormInput): Promise<ActionsResult> => {
  const result = signInSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: {
        message: result.error.message,
      },
    }
  }

  const { email, password } = result.data

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (!existingUser) {
    return {
      isSuccess: false,
      error: { message: '入力されたメールアドレスは登録されていません。' },
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
