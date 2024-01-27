import z from 'zod'

export const signUpSchema = z.object({
  email: z
    .string()
    .email('メールアドレスは必須です。')
    .max(128, 'メールアドレスは128文字以下です。'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上です。')
    .max(128, 'パスワードは128文字以下です。')
    .refine(
      (password: string) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'パスワードは半角英数字の両方を含めてください',
    ),
  nickname: z
    .string()
    .min(1, 'ニックネームは必須です。')
    .max(128, 'ニックネームは128文字以下です。'),
})

export type SignUpFormInput = z.infer<typeof signUpSchema>
