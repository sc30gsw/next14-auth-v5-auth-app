import React, { FC } from 'react'

import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { VariantProps, tv } from 'tailwind-variants'

const spinnerStyles = tv({
  base: 'text-muted-foreground animate-spin',
  variants: {
    size: {
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: { size: 'md' },
})

type SpinnerProps = VariantProps<typeof spinnerStyles> & {
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({ size, className }) => {
  return <Loader className={cn(spinnerStyles({ size }), className)} />
}
