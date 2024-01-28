import { UserRole } from '@prisma/client'
import { z } from 'zod'

export const editProfileSchema = z.object({
  name: z.string().min(1, 'ニックネームは必須です。'),
  email: z.optional(
    z.string().email().max(128, 'メールアドレスは128文字以下です。'),
  ),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),

  password: z.optional(
    z
      .string()
      .refine(
        (password: string) =>
          password === '' ||
          (password.length >= 8 &&
            password.length <= 128 &&
            /[A-Za-z]/.test(password) &&
            /[0-9]/.test(password)),
        'パスワードは8文字以上128文字以下で、半角英数字の両方を含めてください',
      ),
  ),
  newPassword: z.optional(
    z
      .string()
      .refine(
        (password: string) =>
          password === '' ||
          (password.length >= 8 &&
            password.length <= 128 &&
            /[A-Za-z]/.test(password) &&
            /[0-9]/.test(password)),
        'パスワードは8文字以上128文字以下で、半角英数字の両方を含めてください',
      ),
  ),
})

export type EditProfileFormInput = z.infer<typeof editProfileSchema>
