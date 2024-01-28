import React, { FC } from 'react'

import { Footer } from '@/app/components/auth/email/Footer'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import { tv } from 'tailwind-variants'

const otpNotificationEmailStyles = tv({
  slots: {
    body: 'm-auto bg-white font-sans',
    container:
      'mx-auto my-10 max-w-[480px] rounded border border-solid border-gray-200 px-10 py-5',
    heading: 'mx-0 my-7 p-0 text-center',
    content: 'ml-1 leading-4',
    code: '',
  },
  compoundSlots: [{ slots: ['heading', 'content'], class: 'text-black' }],
  variants: {
    color: {
      primary: { code: 'text-blue-600' },
    },
    size: {
      sm: { content: 'text-sm' },
      md: { code: 'font-medium' },
      lg: { heading: 'text-xl font-semibold' },
    },
  },
})

type OtpNotificationEmailProps = {
  email: string
  otpCode: string
}

export const OTPNotificationEmail: FC<OtpNotificationEmailProps> = ({
  email,
  otpCode,
}) => {
  const { body, container, heading, content, code } =
    otpNotificationEmailStyles()

  return (
    <Html>
      <Head />
      <Preview>OTP確認メール</Preview>
      <Tailwind>
        <Body className={body()}>
          <Container className={container()}>
            <Heading className={heading({ size: 'lg' })}>OTP確認メール</Heading>
            <Text className={content({ size: 'sm' })}>
              あなたのOTPコードは
              <span className={code({ color: 'primary', size: 'md' })}>
                {otpCode}
              </span>
              です。このコードを使用して認証を完了してください。
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
