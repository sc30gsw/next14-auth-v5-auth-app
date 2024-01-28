import { PropsWithChildren } from 'react'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import { auth } from '../../auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const RootLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="ja">
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}

export default RootLayout
