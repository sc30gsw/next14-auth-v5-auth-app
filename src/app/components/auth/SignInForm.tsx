'use client'

import React, { useState, useTransition } from 'react'

import { signIn } from '@/actions/signIn'
import { FormError } from '@/app/components/FormError'
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
import { SignInFormInput, signInSchema } from '@/types/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

const signInFormStyles = tv({
  slots: {
    form: 'space-y-6 w-[400px]',
    buttonWrapper: 'flex justify-end',
    link: 'flex justify-end mt-4 text-sm text-blue-500 hover:underline',
  },
})

export const SignInForm = () => {
  const { form, buttonWrapper, link } = signInFormStyles()

  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const signInForm = useForm<SignInFormInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<SignInFormInput> = (data) => {
    setError('')

    startTransition(async () => {
      const result = await signIn(data)

      if (!result.isSuccess) {
        setError(result.error.message)
        return
      }

      toast.success(result.message)
      signInForm.reset()
    })
  }

  return (
    <Form {...signInForm}>
      <form onSubmit={signInForm.handleSubmit(onSubmit)} className={form()}>
        <FormField
          control={signInForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signInForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <div className={buttonWrapper()}>
          <Button type="submit" disabled={isPending}>
            ログイン
          </Button>
        </div>
        <Link href={'/sign-up'} className={link()}>
          新規登録はこちら
        </Link>
      </form>
    </Form>
  )
}
