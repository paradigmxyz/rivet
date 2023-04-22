import * as React from 'react'
import { Box } from './Box'
import type { BackgroundColor, ForegroundColor, Spacing } from '../tokens'

export type ButtonProps = {
  children: string | React.ReactNode
  height?: Extract<Spacing, '40px' | '52px'>
  width?: 'fit' | 'full'
} & (
  | {
      as?: 'button'
      href?: never
      onClick?: () => void
    }
  | {
      as: 'a'
      href: string
      onClick?: never
    }
) &
  (
    | {
        color?: BackgroundColor
        variant?: 'default'
      }
    | {
        color?: ForegroundColor
        variant: 'stroked'
      }
  )

const classesForHeight = {
  '40px': ['px-16px', 'text-16px', 'tracking-wide'],
  '52px': ['px-16px', 'text-18px', 'tracking-wide'],
}

const classesForVariant = ({
  color,
}: { color: ButtonProps['color'] }): Record<
  NonNullable<ButtonProps['variant']>,
  (string | boolean)[]
> => ({
  default: [`bg-${color}`, `hover:bg-${color}/90`, `active:bg-${color}/80`],
  stroked: [
    color !== 'accent' && `border-${color}`,
    color === 'accent' && 'border-accent/20',
    'border-[1.5px]',
    'hover:bg-accent/[0.04]',
    'active:bg-accent/[0.02]',
  ],
})

export function Button({
  as = 'button',
  children,
  color = 'accent',
  height = '52px',
  href,
  onClick,
  variant = 'default',
  width = 'full',
}: ButtonProps) {
  return (
    <Box
      as={as}
      className={[
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-6px',
        'font-medium',
        'transition-colors',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:opacity-50',
        'disabled:pointer-events-none',
        'ring-offset-background',
        `h-${height}`,
        `w-${width}`,
        'text-label',
        ...classesForVariant({ color })[variant],
        ...classesForHeight[height],
      ]}
      href={href}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
