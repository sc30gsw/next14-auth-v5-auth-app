import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

const formErrorStyles = tv({
  slots: {
    base: 'bg-destructive/10 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive',
    icon: 'h-4 w-4',
  },
})

type FormErrorProps = {
  message?: string
}

export const FormError: FC<FormErrorProps> = ({ message }) => {
  const { base, icon } = formErrorStyles()

  if (!message) {
    return null
  }

  return (
    <div className={base()}>
      <ExclamationTriangleIcon className={icon()} />
      <p>{message}</p>
    </div>
  )
}
