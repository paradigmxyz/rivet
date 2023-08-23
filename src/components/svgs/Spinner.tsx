// TODO: Put in ~/design-system
import { Box } from '~/design-system'

export function Spinner({ size }: { size: string }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 40 40"
      stroke="#fff"
      style={{
        height: size,
        maxWidth: size,
      }}
    >
      <Box
        as="g"
        fill="none"
        fillRule="evenodd"
        strokeWidth={3}
        style={{ transform: 'translate(1 1)' }}
      >
        <Box as="circle" cx={18} cy={18} r={18} strokeOpacity={0.5} />
        <Box as="path" d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            dur="1s"
            from="0 18 18"
            repeatCount="indefinite"
            to="360 18 18"
            type="rotate"
          />
        </Box>
      </Box>
    </Box>
  )
}
