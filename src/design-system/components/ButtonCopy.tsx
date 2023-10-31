import { forwardRef, useEffect, useState } from 'react'

import type { UnionOmit } from '~/utils/types'

import { ButtonRoot, type ButtonRootProps } from './Button'
import type { ButtonHeight } from './Button.css'
import { symbolStylesForHeight, symbolStylesForVariant } from './ButtonSymbol'
import { widthForHeight } from './ButtonSymbol.css'
import { SFSymbol, type SFSymbolProps } from './SFSymbol'

type ButtonCopyProps = UnionOmit<
  ButtonRootProps,
  'children' | 'width' | 'onClick'
> & {
  text: string
}

export const checkmarkStylesForHeight = {
  '16px': {
    size: '9px',
  },
  '18px': {
    size: '9px',
  },
  '20px': {
    size: '9px',
  },
  '24px': {
    size: '11px',
  },
  '36px': {
    size: '12px',
  },
  '44px': {
    size: '15px',
  },
} satisfies Record<ButtonHeight, { size: SFSymbolProps['size'] }>

export const ButtonCopy = forwardRef<HTMLDivElement, ButtonCopyProps>(
  (props: ButtonCopyProps, ref) => {
    const { height = '36px', variant = 'solid invert', text } = props

    const [copied, setCopied] = useState(false)
    useEffect(() => {
      if (copied) {
        navigator.clipboard.writeText((text || '').replace(/^"|"$/g, ''))
        setTimeout(() => setCopied(false), 1000)
      }
    }, [copied, text])

    return (
      <ButtonRoot
        ref={ref}
        {...props}
        className={[widthForHeight[height], props.className]}
        onClick={(e) => {
          e.preventDefault()
          setCopied(true)
        }}
      >
        {copied ? (
          <SFSymbol
            symbol="checkmark"
            {...checkmarkStylesForHeight[height]}
            {...symbolStylesForVariant[variant]}
          />
        ) : (
          <SFSymbol
            symbol="doc.on.doc"
            {...symbolStylesForHeight[height]}
            {...symbolStylesForVariant[variant]}
          />
        )}
      </ButtonRoot>
    )
  },
)
