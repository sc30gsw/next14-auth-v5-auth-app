import { SignUpFormInput, signUpSchema } from '@/types/schemas/signUpSchema'

export const signUp = async (data: SignUpFormInput) => {
  const result = signUpSchema.safeParse(data)

  if (!result.success) {
    return {
      isSuccess: false,
      error: {
        message: result.error.message,
      },
    }
  }

  return {
    isSuccess: true,
    message: 'サインアップに成功しました',
  }
}
