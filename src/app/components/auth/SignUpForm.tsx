'use client'

import { signUp } from '@/actions/signUp'
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
import { SignUpFormInput, signUpSchema } from '@/types/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

const signUpFormStyles = tv({
  slots: {
    form: 'space-y-8 w-[400px]',
    buttonWrapper: 'flex justify-end',
  },
})

export const SignUpForm = () => {
  const { form, buttonWrapper } = signUpFormStyles()

  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const signUpForm = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<SignUpFormInput> = (data) => {
    setError('')

    startTransition(async () => {
      const result = await signUp(data)

      if (!result.isSuccess) {
        setError(result.error?.message)
        return
      }

      toast.success(result.message)
    })
  }

  return (
    <Form {...signUpForm}>
      <form onSubmit={signUpForm.handleSubmit(onSubmit)} className={form()}>
        <FormField
          control={signUpForm.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ニックネーム</FormLabel>
              <FormControl>
                <Input placeholder="nickname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signUpForm.control}
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
          control={signUpForm.control}
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
