import z from 'zod'

export const passwordResetSchema = z.object({
  email: z
    .string()
    .email('メールアドレスは必須です。')
    .max(128, 'メールアドレスは128文字以下です。'),
})

export type PasswordResetFormInput = z.infer<typeof passwordResetSchema>
