import * as Progress_ from '@radix-ui/react-progress'
import { Box } from '~/design-system'

export function Progress({
  height,
  progress,
}: { height: number; progress: number }) {
  return (
    <Progress_.Root asChild value={progress}>
      <Box
        backgroundColor='surface/invert@0.2'
        borderRadius='round'
        position='relative'
        overflow='hidden'
        width='full'
        style={{ height }}
      >
        <Progress_.Indicator asChild>
          <Box
            backgroundColor='surface/invert'
            height='full'
            width='full'
            style={{
              transform: `translateX(-${100 - progress}%)`,
              transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          />
        </Progress_.Indicator>
      </Box>
    </Progress_.Root>
  )
}
