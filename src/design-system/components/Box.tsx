import type * as Polymorphic from '@radix-ui/react-polymorphic'
import type { ClassValue } from 'clsx'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type PolymorphicBox = Polymorphic.ForwardRefComponent<
  'div',
  {
    className?: ClassValue
    testId?: string
  }
>

/**
 * Box is a low-level primitive that should only be used when building design system components,
 * or when other layout primitives (such as: Rows, Inline, Columns, etc) are not sufficient.
 */
export const Box = forwardRef(
  ({ as: Component = 'div', className, testId, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(className)}
        data-testid={testId}
        {...props}
      />
    )
  },
) as PolymorphicBox

Box.displayName = 'Box'
