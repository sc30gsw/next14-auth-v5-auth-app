'use client'

import { newPassword } from '@/actions/email/newPassword'
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
  NewPasswordFormInput,
  newPasswordSchema,
} from '@/types/schemas/newPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

const newPasswordFormStyles = tv({
  slots: {
    form: 'space-y-6 w-[400px] mt-10',
    formFieldWrapper: 'space-y-4',
    buttonWrapper: 'flex justify-end',
  },
})

export const NewPasswordForm = () => {
  const { form, formFieldWrapper, buttonWrapper } = newPasswordFormStyles()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const newPasswordForm = useForm<NewPasswordFormInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '' },
  })

  const onSubmit: SubmitHandler<NewPasswordFormInput> = (data) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const result = await newPassword(data, token)

      if (!result.isSuccess) {
        setError(result.error.message)
        return
      }

      toast.success(result.message)
      newPasswordForm.reset()

      setTimeout(() => {
        router.push('/sign-in')
      }, 1500)
    })
  }
  return (
    <Form {...newPasswordForm}>
      <form
        onSubmit={newPasswordForm.handleSubmit(onSubmit)}
        className={form()}
      >
        <div className={formFieldWrapper()}>
          <FormField
            control={newPasswordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="password"
                    disabled={isPending}
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
            パスワードをリセット
          </Button>
        </div>
      </form>
    </Form>
  )
}
