import React from 'react'

import { SignInForm } from '@/app/components/auth/SignInForm'
import { SocialButtons } from '@/app/components/auth/SocialButtons'
import { tv } from 'tailwind-variants'

const signInPageStyles = tv({
  base: 'flex flex-col justify-center items-center my-5',
})

const SignInPage = () => {
  return (
    <div className={signInPageStyles()}>
      <SignInForm />
      <SocialButtons />
    </div>
  )
}

export default SignInPage
