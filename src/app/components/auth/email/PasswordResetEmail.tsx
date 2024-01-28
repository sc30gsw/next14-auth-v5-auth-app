import React, { FC } from 'react'

import { Footer } from '@/app/components/auth/email/Footer'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { tv } from 'tailwind-variants'

const passwordResetEmailStyles = tv({
  slots: {
    body: 'm-auto bg-white font-sans',
    container:
      'mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5',
    section: 'mt-8',
    heading: 'mx-0 my-7 p-0 text-center',
    content: 'ml-1 text-sm leading-4',
    link: 'no-underline',
  },
  compoundSlots: [{ slots: ['heading', 'content'], class: 'text-black' }],
  variants: {
    color: {
      primary: { link: 'text-blue-600' },
    },
    size: {
      sm: {
        content: 'text-sm',
      },
      md: {
        link: 'font-medium',
      },
      lg: {
        heading: 'text-xl font-semibold',
      },
    },
  },
})

type PasswordResetEmailProps = {
  email: string
  resetLink: string
}

export const PasswordResetEmail: FC<PasswordResetEmailProps> = ({
  email,
  resetLink,
}) => {
  const { body, container, section, heading, content, link } =
    passwordResetEmailStyles()

  return (
    <Html>
      <Head />
      <Preview>パスワードの再設定について</Preview>
      <Tailwind>
        <Body className={body()}>
          <Container className={container()}>
            <Section className={section()} />
            <Heading className={heading({ color: 'primary', size: 'lg' })}>
              確認メールの送信
            </Heading>
            <Text className={content({ size: 'sm' })}>
              ◆
              このメールは、ログイン時にご入力いただいたメールアドレス宛に自動的にお送りしています。
              こちらの
              <Link href={resetLink} className={link({ size: 'md' })}>
                リンク
              </Link>
              をクリックして、メールアドレスの確認を完了してください。
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
