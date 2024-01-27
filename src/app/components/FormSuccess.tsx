import { CheckCircledIcon } from '@radix-ui/react-icons'
import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

const formSuccessStyles = tv({
  slots: {
    base: 'bg-emerald-500/10 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500',
    icon: 'h-4 w-4',
  },
})

type FormSuccessProps = {
  message: string
}

export const FormSuccess: FC<FormSuccessProps> = ({ message }) => {
  const { base, icon } = formSuccessStyles()

  if (!message) {
    return null
  }

  return (
    <div className={base()}>
      <CheckCircledIcon className={icon()} />
      <p>{message}</p>
    </div>
  )
}
