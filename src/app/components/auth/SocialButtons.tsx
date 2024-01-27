'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { tv } from 'tailwind-variants'
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '../../../../routes'

const socialButtonsStyles = tv({
  slots: {
    root: 'flex items-center w-full gap-x-2 mt-5',
    icon: 'h-5 w-5',
    button: 'w-full',
    buttonText: 'ml-2',
  },
})

export const SocialButtons = () => {
  const { root, icon, button, buttonText } = socialButtonsStyles()

  const handleClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <div className={root()}>
      <Button
        size="lg"
        className={button()}
        variant="outline"
        onClick={() => handleClick('google')}
      >
        <FcGoogle className={icon()} />
        <span className={buttonText()}>Google</span>
      </Button>
      <Button
        size="lg"
        className={button()}
        variant="outline"
        onClick={() => handleClick('github')}
      >
        <FaGithub className={icon()} />
        <span className={buttonText()}>GitHub</span>
      </Button>
    </div>
  )
}
