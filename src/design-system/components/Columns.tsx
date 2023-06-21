import { type ReactNode, forwardRef } from 'react'
import flattenChildren from 'react-flatten-children'

import type { Spacing } from '../tokens'
import { Box } from './Box'
import * as styles from './Columns.css'

const alignHorizontalToJustifyContent = {
  center: 'center',
  justify: 'space-between',
  left: 'flex-start',
  right: 'flex-end',
} as const
type AlignHorizontal = keyof typeof alignHorizontalToJustifyContent

const alignVerticalToAlignItems = {
  bottom: 'flex-end',
  center: 'center',
  top: 'flex-start',
} as const
type AlignVertical = keyof typeof alignVerticalToAlignItems

type ColumnsProps = {
  alignHorizontal?: AlignHorizontal
  alignVertical?: AlignVertical
  children: ReactNode
  gap?: Spacing
  width?: 'full'
}

export const Columns = forwardRef<HTMLDivElement, ColumnsProps>(
  (
    {
      alignHorizontal,
      alignVertical,
      children,
      gap = '0px',
      width,
    }: ColumnsProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        display='flex'
        flexDirection='row'
        height='full'
        gap={gap}
        alignItems={alignVertical && alignVerticalToAlignItems[alignVertical]}
        justifyContent={
          alignHorizontal && alignHorizontalToJustifyContent[alignHorizontal]
        }
        width={width}
      >
        {flattenChildren(children).map((child, index) => {
          const columnProps = getColumnProps(child)

          return columnProps ? (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <PrivateColumn key={index} {...columnProps} />
          ) : (
            <PrivateColumn key={index}>{child}</PrivateColumn>
          )
        })}
      </Box>
    )
  },
)

type ColumnProps = {
  alignVertical?: AlignVertical
  width?: 'content' | keyof typeof styles.width
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Column(_props: ColumnProps): JSX.Element {
  // We use this pattern to ensure that Column can only be used within Columns.
  // Columns detects when this element has been used and replaces it with an
  // instance of PrivateColumn instead, which means that this component is
  // never actually rendered when used correctly.
  throw new Error(
    'Column: Must be a direct child of Columns within the same component.',
  )
}
Column.__isColumn__ = true

function getColumnProps(node: NonNullable<ReactNode>): ColumnProps | null {
  return typeof node === 'object' &&
    'type' in node &&
    // @ts-expect-error This lets us detect Column elements even if they've
    // been hot reloaded. If we checked that node.type === Column, it will
    // fail if Column has been dynamically replaced with a new component.
    node.type.__isColumn__
    ? (node.props as ColumnProps)
    : null
}

function PrivateColumn({ alignVertical, children, width }: ColumnProps) {
  if (width) {
    return (
      <Box
        className={width !== 'content' ? styles.width[width] : undefined}
        display='flex'
        flexDirection='column'
        flexGrow='0'
        flexShrink='0'
        height='full'
        justifyContent={
          alignVertical && alignVerticalToAlignItems[alignVertical]
        }
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      className={styles.width['0']}
      display='flex'
      flexDirection='column'
      flexGrow='1'
      flexShrink='1'
      flexBasis='0'
      justifyContent={alignVertical && alignVerticalToAlignItems[alignVertical]}
      height='full'
    >
      {children}
    </Box>
  )
}
