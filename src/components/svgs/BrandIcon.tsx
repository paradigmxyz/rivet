import { Box } from '~/design-system'
import { backgroundColorVars } from '~/design-system/styles/theme.css'

export function BrandIcon({ size }: { size: `${number}px` }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29 29"
      style={{
        height: size,
        width: size,
      }}
    >
      <Box
        as="path"
        d="m14.5 0 12.557 7.25v14.5L14.5 29 1.943 21.75V7.25L14.5 0Z"
        fill="currentColor"
      />
      <Box
        as="circle"
        cx={14.658}
        cy={14.342}
        r={6.462}
        fill={`rgb(${backgroundColorVars['surface/primary/elevated']})`}
      />
      <Box as="circle" cx={14.658} cy={14.342} r={3.31} fill="currentColor" />
    </Box>
  )
}
