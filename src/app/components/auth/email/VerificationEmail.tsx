import React, { FC } from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import { tv } from 'tailwind-variants'

const verificationEmailStyles = tv({
  slots: {
    body: 'm-auto bg-white font-sans',
    container:
      'mx-auto my-10 max-w-[480px] rounded border border-solid border-gray-200 px-10 py-5',
    heading: 'mx-10 my-7 p-0 text-center',
    link: '',
  },
  variants: {
    color: {
      primary: {
        link: 'text-blue-600',
      },
      secondary: {
        heading: 'text-black',
      },
    },
    size: {
      md: {
        link: 'font-medium',
      },
      lg: {
        heading: 'text-xl font-semibold',
      },
    },
  },
})

type VerificationEmailProps = {
  email: string
  confirmLink: string
}

export const VerificationEmail: FC<VerificationEmailProps> = ({
  email,
  confirmLink,
}) => {
  const { body, container, heading, link } = verificationEmailStyles()

  return (
    <Html>
      <Head />
      <Preview>確認メールの送信</Preview>
      <Tailwind>
        <Body className={body()}>
          <Container className={container()}>
            <Heading className={heading({ color: 'secondary', size: 'lg' })}>
              確認メールの送信
            </Heading>
            <Text>
              ◆
              このメールは、ログイン時にご入力いただいたメールアドレス宛に自動的にお送りしています。
              <Link
                href={confirmLink}
                className={link({ color: 'primary', size: 'md' })}
              >
                こちらのリンクをクリック
              </Link>
              して、メールアドレスの確認を完了してください
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
