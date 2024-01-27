import React, { FC } from 'react'

import { Hr, Tailwind, Text } from '@react-email/components'
import { tv } from 'tailwind-variants'

const footerStyles = tv({
  slots: {
    hrBorder: 'mx-0 my-6 w-full border border-gray-200',
    text: 'text-[12px] leading-6 text-gray-500',
    emailText: 'text-black',
  },
})

type FooterProps = {
  email: string
}

export const Footer: FC<FooterProps> = ({ email }) => {
  const { hrBorder, text, emailText } = footerStyles()

  return (
    <Tailwind>
      <Hr className={hrBorder()} />

      <Text className={text()}>
        このメールは<span className={emailText()}>{email}</span>
        宛に送信されました。このメールに心当たりがない場合は、お手数ですがこのまま削除してください。
      </Text>
    </Tailwind>
  )
}
