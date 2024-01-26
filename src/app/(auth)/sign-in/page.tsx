import React from 'react'

import { SignInForm } from '@/app/components/auth/SignInForm'
import { tv } from 'tailwind-variants'

const signInPageStyles = tv({
  base: 'flex justify-center items-center my-5',
})

const SignInPage = () => {
  return (
    <div className={signInPageStyles()}>
      <SignInForm />
    </div>
  )
}

export default SignInPage
