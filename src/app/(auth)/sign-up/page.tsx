import { SignUpForm } from '@/app/components/auth/SignUpForm'
import { SocialButtons } from '@/app/components/auth/SocialButtons'
import React from 'react'
import { tv } from 'tailwind-variants'

const signUpPageStyles = tv({
  base: 'flex flex-col justify-center items-center my-5',
})

const SignUpPage = () => {
  return (
    <div className={signUpPageStyles()}>
      <SignUpForm />
      <SocialButtons />
    </div>
  )
}

export default SignUpPage
