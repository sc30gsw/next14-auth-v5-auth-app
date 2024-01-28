import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  })

  if (existingToken) {
    await prisma.verificationToken.delete({ where: { id: existingToken.id } })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: { email, token, expires },
  })

  return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  })

  if (existingToken) {
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } })
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: { email, token, expires },
  })

  return passwordResetToken
}

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(1000, 10000).toString()
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000)

  const existingToken = await prisma.twoFactorToken.findFirst({
    where: { email },
  })

  if (existingToken) {
    await prisma.twoFactorToken.delete({ where: { id: existingToken.id } })
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: { email, token, expires },
  })

  return twoFactorToken
}
