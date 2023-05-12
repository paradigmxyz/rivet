import { Outlet } from 'react-router-dom'

import { Box } from '../../../design-system/components/Box'

export default function Layout() {
  return (
    <Box
      backgroundColor="body"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: '100vh',
      }}
    >
      <Box
        backgroundColor="surface"
        borderWidth="1px"
        display="flex"
        padding="24px"
        style={{
          height: 560,
          width: 360,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
