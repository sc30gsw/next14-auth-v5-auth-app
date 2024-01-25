import { SignUpForm } from '@/app/components/auth/SignUpForm'
import React from 'react'
import { tv } from 'tailwind-variants'

const signUpPageStyles = tv({
  base: 'flex justify-center items-center my-5',
})

const SignUpPage = () => {
  return (
    <div className={signUpPageStyles()}>
      <SignUpForm />
    </div>
  )
}

export default SignUpPage
