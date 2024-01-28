import { UserRole } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      role: UserRole
      isTwoFactorEnabled?: boolean
      isOauth?: boolean
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  // biome-ignore lint/style/useNamingConvention: for library types
  interface JWT {
    role?: UserRole
    isTwoFactorEnabled?: boolean
    isOauth?: boolean
  }
}
