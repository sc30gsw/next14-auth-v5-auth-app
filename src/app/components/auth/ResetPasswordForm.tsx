'use client'

import { resetPassword } from '@/actions/email/resetPassword'
import { FormError } from '@/app/components/FormError'
import { FormSuccess } from '@/app/components/FormSuccess'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  PasswordResetFormInput,
  passwordResetSchema,
} from '@/types/schemas/passwordResetSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { tv } from 'tailwind-variants'

const resetPasswordFormStyles = tv({
  slots: {
    form: 'space-y-6 w-[400px] mt-10',
    formFieldWrapper: 'space-y-4',
    buttonWrapper: 'flex justify-end',
  },
})

export const ResetPasswordForm = () => {
  const { form, formFieldWrapper, buttonWrapper } = resetPasswordFormStyles()

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const resetPasswordForm = useForm<PasswordResetFormInput>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: '' },
  })

  const onSubmit: SubmitHandler<PasswordResetFormInput> = (data) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const result = await resetPassword(data)

      if (!result.isSuccess) {
        setError(result.error.message)
        return
      }

      setSuccess(result.message)
      resetPasswordForm.reset()

      setTimeout(() => {
        router.push('/sign-in')
      }, 1500)
    })
  }

  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
        className={form()}
      >
        <div className={formFieldWrapper()}>
          <FormField
            control={resetPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success || ''} />
        <div className={buttonWrapper()}>
          <Button type="submit" disabled={isPending}>
            メールを送信
          </Button>
        </div>
      </form>
    </Form>
  )
}
