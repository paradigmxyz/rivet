import { Box } from '~/design-system'
import { backgroundColorVars } from '~/design-system/styles/theme.css'

import * as styles from './Cog.css'

export function Cog({ size }: { size: string }) {
  return (
    <Box
      as="svg"
      className={styles.spin}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 75 74"
      fill="none"
      style={{
        height: size,
        maxWidth: size,
      }}
    >
      <Box
        as="path"
        fill={`rgb(${backgroundColorVars['surface/invert']})`}
        d="m45.265 8.022 21.213 21.213-7.765 28.978-28.978 7.765L8.522 44.765l7.765-28.978 28.978-7.765Z"
      />
      <circle
        cx={37.9}
        cy={36.769}
        r={13.37}
        fill={`rgb(${backgroundColorVars['surface/primary']})`}
      />
      <circle
        cx={37.9}
        cy={36.769}
        r={6.848}
        fill={`rgb(${backgroundColorVars['surface/invert']})`}
      />
    </Box>
  )
}
