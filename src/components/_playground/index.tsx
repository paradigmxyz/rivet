import '../../hmr'

import { useState } from 'react'
import ReactDOM from 'react-dom/client'

import '~/design-system/styles/global.css'

import { parseAbiItem } from 'abitype'
import { DecodedAbiParameters, FormattedAbiItem } from '~/components'
import { Box, Stack, Text, type Theme } from '~/design-system'
import { fulfillAvailableAdvancedOrdersAbiItem } from './constants'

function Components() {
  const [theme, setTheme] = useState<Theme>('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = newTheme
    setTheme(newTheme)
  }

  return (
    <Box
      marginHorizontal="auto"
      paddingTop="40px"
      style={{ maxWidth: '1152px' }}
    >
      <Box
        as="button"
        onClick={toggleTheme}
        style={{ fontSize: 48, position: 'fixed', left: 16 }}
      >
        {theme === 'dark' ? '🌞' : '🌝'}
      </Box>
      <Stack gap="24px">
        <Text weight="medium" size="22px">
          FormattedAbiItem
        </Text>
        <Box
          backgroundColor="surface/primary/elevated"
          paddingVertical="12px"
          style={{ maxWidth: '375px' }}
        >
          <Stack gap="16px">
            <FormattedAbiItem abiItem={parseAbiItem('function foo()')} />
            <FormattedAbiItem
              abiItem={parseAbiItem('function foo() returns (uint256)')}
            />
            <FormattedAbiItem
              abiItem={parseAbiItem(
                'function foo() payable returns (uint256 bar, bool baz)',
              )}
            />
            <FormattedAbiItem
              abiItem={parseAbiItem(
                'function cancel(string foo) external returns (bool cancelled)',
              )}
            />
            <FormattedAbiItem abiItem={fulfillAvailableAdvancedOrdersAbiItem} />
            <FormattedAbiItem
              abiItem={parseAbiItem(
                'event Foo(address indexed from, address indexed to, uint256 amount)',
              )}
            />
            <FormattedAbiItem abiItem={parseAbiItem('constructor(string)')} />
            <FormattedAbiItem
              abiItem={parseAbiItem('constructor(string foo) payable')}
            />
            <FormattedAbiItem
              abiItem={parseAbiItem('receive() external payable')}
            />
          </Stack>
        </Box>
        <Text weight="medium" size="22px">
          DecodedAbiParameters
        </Text>
        <Box
          backgroundColor="surface/primary/elevated"
          paddingVertical="12px"
          style={{ maxWidth: '375px' }}
        >
          <DecodedAbiParameters
            params={[
              { name: 'a', type: 'bool' },
              { name: 'b', type: 'bytes' },
              { name: 'c', type: 'uint' },
              { name: 'd', type: 'string' },
              { name: 'e', type: 'bool[3]' },
              { name: 'f', type: 'bytes[]' },
              { name: 'g', type: 'uint[]' },
              { name: 'h', type: 'string[]' },
              {
                name: 'i',
                internalType: 'Foo',
                type: 'tuple',
                components: [{ name: 'a', type: 'bytes' }],
              },
              {
                name: 'j',
                internalType: 'Bar',
                type: 'tuple',
                components: [
                  { name: 'a', type: 'bool' },
                  { name: 'b', type: 'bytes' },
                  { name: 'c', type: 'uint' },
                  { name: 'd', type: 'string' },
                  { name: 'e', type: 'bool[]' },
                  { name: 'f', type: 'bytes[]' },
                  { name: 'g', type: 'uint[]' },
                  { name: 'h', type: 'string[]' },
                  {
                    name: 'i',
                    internalType: 'Baz',
                    type: 'tuple',
                    components: [
                      { name: 'a', type: 'bytes' },
                      { name: 'b', type: 'bool[]' },
                      { name: 'c', type: 'string' },
                    ],
                  },
                  {
                    name: 'j',
                    internalType: 'Baz',
                    type: 'tuple',
                    components: [
                      { name: 'a', type: 'bytes' },
                      { type: 'bool[]' },
                      { name: 'c', type: 'string' },
                    ],
                  },
                ],
              },
              {
                internalType: 'BarLongNameLongNameLongName[2]',
                type: 'tuple[2]',
                components: [
                  { name: 'a', type: 'bool' },
                  { name: 'b', type: 'bytes' },
                  { name: 'c', type: 'uint' },
                  { name: 'd', type: 'string' },
                  { name: 'e', type: 'bool[]' },
                  { name: 'f', type: 'bytes[]' },
                  { name: 'g', type: 'uint[]' },
                  { name: 'h', type: 'string[]' },
                  {
                    name: 'i',
                    internalType: 'Baz',
                    type: 'tuple',
                    components: [
                      { name: 'a', type: 'bytes' },
                      { name: 'b', type: 'bool[]' },
                      { name: 'c', type: 'string' },
                    ],
                  },
                  {
                    name: 'j',
                    internalType: 'Baz[]',
                    type: 'tuple[]',
                    components: [
                      { name: 'a', type: 'bytes' },
                      { type: 'bool[]' },
                      { name: 'c', type: 'string' },
                    ],
                  },
                ],
              },
              {
                name: 'longNamelongName',
                internalType: 'foo.bar BarLongNameLongName[][]',
                type: 'tuple[][]',
                components: [{ name: 'a', type: 'bool' }],
              },
            ]}
            args={[
              true,
              '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
              69420694206942069420694206942069420n,
              'hello world this is me yeah booyyy',
              [true, false, true],
              [
                '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
              ],
              [69420n, 420n, 69n, 69420n, 420n, 69n],
              ['hello world this is me yeah booyyy'],
              {
                a: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
              },
              {
                a: true,
                b: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                c: 69420n,
                d: 'hello world this is me yeah booyyy',
                e: [true, false, true],
                f: [
                  '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                ],
                g: [69420n, 420n, 69n, 69420n, 420n, 69n],
                h: ['hello world this is me yeah booyyy'],
                i: {
                  a: '0xdeadbeef',
                  b: [true, false, true],
                  c: 'hello world',
                },
                j: ['0xdeadbeef', [true, false, true], 'hello world'],
              },
              [
                {
                  a: true,
                  b: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  c: 69420n,
                  d: 'hello world this is me yeah booyyy',
                  e: [true, false, true],
                  f: [
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  ],
                  g: [69420n, 420n, 69n, 69420n, 420n, 69n],
                  h: ['hello world this is me yeah booyyy'],
                  i: {
                    a: '0xdeadbeef',
                    b: [true, false, true],
                    c: 'hello world',
                  },
                  j: [
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                  ],
                },
                {
                  a: true,
                  b: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  c: 69420n,
                  d: 'hello world this is me yeah booyyy',
                  e: [true, false, true],
                  f: [
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  ],
                  g: [69420n, 420n, 69n, 69420n, 420n, 69n],
                  h: ['hello world this is me yeah booyyy'],
                  i: {
                    a: '0xdeadbeef',
                    b: [true, false, true],
                    c: 'hello world',
                  },
                  j: [
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                    ['0xdeadbeef', [true, false, true], 'hello world'],
                  ],
                },
              ],
              [[{ a: true }]],
            ]}
          />
        </Box>
      </Stack>
    </Box>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Components />,
)
