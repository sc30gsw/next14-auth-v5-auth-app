'use client'

import { newVerification } from '@/actions/email/verifyEmail'
import { FormError } from '@/app/components/FormError'
import { FormSuccess } from '@/app/components/FormSuccess'
import { Spinner } from '@/app/components/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'

const newVerificationClientStyles = tv({
  base: 'flex items-center w-full justify-center mt-10',
})

export const NewVerificationClient = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const router = useRouter()

  const searchParam = useSearchParams()
  const token = searchParam.get('token')

  const verificationToken = useCallback(async () => {
    if (error || success) {
      return
    }

    if (!token) {
      setError('トークンの取得に失敗しました。')
      return
    }

    const result = await newVerification(token)

    if (!result.isSuccess) {
      setError(result.error.message)
      return
    }

    setSuccess(result.message)

    setTimeout(() => {
      router.push('/sign-in')
    }, 1500)
  }, [error, success, token, router])

  useEffect(() => {
    verificationToken()
  }, [verificationToken])

  return (
    <div className={newVerificationClientStyles()}>
      {!(success || error) && <Spinner size={'lg'} />}
      <FormSuccess message={success || ''} />
      {!success && <FormError message={error} />}
    </div>
  )
}
