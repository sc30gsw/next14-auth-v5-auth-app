import React, { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'
import { Noto_Sans_JP } from 'next/font/google'

const authLayoutStyles = tv({
  slots: {
    container:
      'container flex flex-col h-full justify-center items-center py-4 lg:py-6',
    title: 'text-3xl font-semibold text-center',
  },
})

const font = Noto_Sans_JP({ subsets: ['latin'], weight: ['600'] })

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { container, title } = authLayoutStyles()

  return (
    <main className={container()}>
      <h1 className={cn(title(), font.className)}>🔐 認証入門</h1>
      {children}
    </main>
  )
}

export default AuthLayout
