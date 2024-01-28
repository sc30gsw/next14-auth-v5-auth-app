import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // biome-ignore lint/style/noVar: It is written in the official documentation
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

// biome-ignore lint/suspicious/noRedeclare: It is written in the official documentation
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
