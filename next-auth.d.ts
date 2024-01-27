import { AdapterUser } from '@auth/core/adapters'
import { JWT } from '@auth/core/jwt'
import { UserRole } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      role: UserRole
    } & DefaultSession['user']
  }
}
