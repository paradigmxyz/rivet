import { useState } from 'react'

import { AccentColorProvider } from '../../design-system/AccentColorProvider'
import { ThemeProvider } from '../../design-system/ThemeProvider'
import { Bleed } from '../../design-system/components/Bleed'
import { Box } from '../../design-system/components/Box'
import { Button } from '../../design-system/components/Button'
import { Column, Columns } from '../../design-system/components/Columns'
import { Inline } from '../../design-system/components/Inline'
import { Input } from '../../design-system/components/Input'
import { Inset } from '../../design-system/components/Inset'
import { Row, Rows } from '../../design-system/components/Rows'
import { SFSymbol } from '../../design-system/components/SFSymbol'
import { Separator } from '../../design-system/components/Separator'
import { Stack } from '../../design-system/components/Stack'
import { Text } from '../../design-system/components/Text'
import { Theme } from '../../design-system/tokens'

export default function DesignSystem() {
  const [colorMode, setColorMode] = useState<Theme>('dark')

  const toggleTheme = () => {
    const newTheme = colorMode === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = newTheme
    setColorMode(newTheme)
  }

  return (
    <Box
      backgroundColor="body"
      marginHorizontal="auto"
      maxWidth="1152px"
      paddingTop="40px"
    >
      <Box
        as="button"
        onClick={toggleTheme}
        style={{ fontSize: 48, position: 'fixed', left: 16 }}
      >
        {colorMode === 'dark' ? '🌞' : '🌝'}
      </Box>
      <Stack gap="72px">
        <Text weight="semibold" size="32px">
          Design System
        </Text>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Color System
            </Text>
            <Box backgroundColor="body" padding="8px">
              <Stack gap="8px">
                <Box backgroundColor="body" borderWidth="1.5px" padding="20px">
                  <Text>body</Text>
                </Box>
                <Box
                  backgroundColor="bodyHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>bodyHover</Text>
                </Box>
                <Box
                  backgroundColor="surface"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>surface</Text>
                </Box>
                <Box
                  backgroundColor="surfaceHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>surfaceHover</Text>
                </Box>
                <Box
                  backgroundColor="primary"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>primary</Text>
                </Box>
                <Box
                  backgroundColor="primaryHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>primaryHover</Text>
                </Box>
                <Box backgroundColor="white" borderWidth="1.5px" padding="20px">
                  <Text>white</Text>
                </Box>
                <Box
                  backgroundColor="whiteHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>whiteHover</Text>
                </Box>
                <Box backgroundColor="black" borderWidth="1.5px" padding="20px">
                  <Text>black</Text>
                </Box>
                <Box
                  backgroundColor="blackHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>blackHover</Text>
                </Box>
                <Box backgroundColor="red" borderWidth="1.5px" padding="20px">
                  <Text>red</Text>
                </Box>
                <Box
                  backgroundColor="redHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>redHover</Text>
                </Box>
                <Box
                  backgroundColor="redTint"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>redTint</Text>
                </Box>
                <Box
                  backgroundColor="redTintHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>redTintHover</Text>
                </Box>
                <Box backgroundColor="green" borderWidth="1.5px" padding="20px">
                  <Text>green</Text>
                </Box>
                <Box
                  backgroundColor="greenHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>greenHover</Text>
                </Box>
                <Box
                  backgroundColor="greenTint"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>greenTint</Text>
                </Box>
                <Box
                  backgroundColor="greenTintHover"
                  borderWidth="1.5px"
                  padding="20px"
                >
                  <Text>greenTintHover</Text>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Color System
            </Text>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                Contextual Inheritence
              </Text>
              <Box backgroundColor="white" padding="8px">
                <Text>White Context</Text>
                <Box style={{ height: 10 }} />
                <Box backgroundColor="body" padding="8px">
                  <Text>Body Context</Text>
                  <Box style={{ height: 10 }} />
                  <Box backgroundColor="black" padding="8px">
                    <Text>Black Context</Text>
                    <Box style={{ height: 10 }} />
                    <Box backgroundColor="surface" padding="8px">
                      <Text>Surface Context</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box backgroundColor="red" borderWidth="1px" padding="8px">
                <Text>Red Context</Text>
              </Box>
              <Box backgroundColor="redTint" borderWidth="1px" padding="8px">
                <Text>Red Tint Context</Text>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                ThemeProvider
              </Text>
              <ThemeProvider theme="light">
                <Box padding="8px">
                  <Text>Light Mode</Text>
                </Box>
              </ThemeProvider>
              <ThemeProvider theme="dark">
                <Box padding="8px">
                  <Text>Dark Mode</Text>
                </Box>
              </ThemeProvider>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                AccentColorProvider
              </Text>
              <AccentColorProvider color="red">
                <Box backgroundColor="accent" padding="8px">
                  <Text>Red Background Accent</Text>
                  <Box style={{ height: 10 }} />
                  <AccentColorProvider color="white">
                    <Box backgroundColor="accent" padding="8px">
                      <Text>White Background Accent</Text>
                    </Box>
                  </AccentColorProvider>
                </Box>
              </AccentColorProvider>
              <AccentColorProvider color="red">
                <Box backgroundColor="body" padding="8px">
                  <Text color="accent">Red Text Accent</Text>
                  <Box style={{ height: 10 }} />
                  <AccentColorProvider color="pink">
                    <Text color="accent">Pink Text Accent</Text>
                  </AccentColorProvider>
                </Box>
              </AccentColorProvider>
            </Stack>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Bleed
            </Text>
            <Box backgroundColor="body">
              <Bleed space="-8px">
                <Box backgroundColor="primary / 0.2" style={{ height: 50 }} />
              </Bleed>
            </Box>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Button
            </Text>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                Solid
              </Text>
              <Box display="flex" gap="8px">
                <Button variant="solid primary" width="fit">
                  Button
                </Button>
                <Button variant="solid body" width="fit">
                  Button
                </Button>
                <Button variant="solid green" width="fit">
                  Button
                </Button>
                <Button variant="solid red" width="fit">
                  Button
                </Button>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                Stroked
              </Text>
              <Box display="flex" gap="8px">
                <Button variant="stroked primary" width="fit">
                  Button
                </Button>
                <Button variant="stroked scrim" width="fit">
                  Button
                </Button>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                Tint
              </Text>
              <Box display="flex" gap="8px">
                <Button variant="tint green" width="fit">
                  Button
                </Button>
                <Button variant="tint red" width="fit">
                  Button
                </Button>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="18px">
                Height
              </Text>
              <Box display="flex" gap="8px">
                <Button height="44px" width="fit">
                  Button
                </Button>
                <Button variant="stroked primary" height="44px" width="fit">
                  Button
                </Button>
                <Button variant="tint green" height="44px" width="fit">
                  Button
                </Button>
              </Box>
              <Box display="flex" gap="8px">
                <Button height="36px" width="fit">
                  Button
                </Button>
                <Button variant="stroked primary" height="36px" width="fit">
                  Button
                </Button>
                <Button variant="tint green" height="36px" width="fit">
                  Button
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Columns
            </Text>
            <Columns gap="12px">
              <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
            </Columns>
            <Columns gap="12px">
              <Column width="1/4">
                <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              </Column>
              <Column width="1/3">
                <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              </Column>
              <Column>
                <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              </Column>
            </Columns>
            <Columns gap="12px">
              <Box backgroundColor="primary / 0.2" style={{ height: 100 }} />
              <Column width="content">
                <Box
                  backgroundColor="primary / 0.2"
                  style={{ height: 100, width: 100 }}
                />
              </Column>
            </Columns>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Inline
            </Text>
            <Inline gap="8px">
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ height: 50, width: 50 }}
              />
            </Inline>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Input
            </Text>
            <Input placeholder="Enter your email..." />
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Inset
            </Text>
            <Box backgroundColor="body">
              <Inset space="24px">
                <Box backgroundColor="primary / 0.2" style={{ height: 50 }} />
              </Inset>
            </Box>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Rows
            </Text>
            <Box style={{ height: 300 }}>
              <Rows gap="12px">
                <Box backgroundColor="primary / 0.2" height="full" />
                <Box backgroundColor="primary / 0.2" height="full" />
                <Box backgroundColor="primary / 0.2" height="full" />
              </Rows>
            </Box>
            <Box style={{ height: 300 }}>
              <Rows gap="12px">
                <Row height="1/4">
                  <Box backgroundColor="primary / 0.2" height="full" />
                </Row>
                <Row height="1/4">
                  <Box backgroundColor="primary / 0.2" height="full" />
                </Row>
                <Row>
                  <Box backgroundColor="primary / 0.2" height="full" />
                </Row>
              </Rows>
            </Box>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Separator
            </Text>
            <Separator />
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              SFSymbol
            </Text>
            <Box display="flex" gap="8px">
              <SFSymbol symbol="person.circle" size="40px" />
              <SFSymbol symbol="wallet.pass" size="40px" />
            </Box>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Stack
            </Text>
            <Stack gap="16px">
              <Box backgroundColor="primary / 0.2" style={{ height: 40 }} />
              <Box backgroundColor="primary / 0.2" style={{ height: 40 }} />
              <Box backgroundColor="primary / 0.2" style={{ height: 40 }} />
            </Stack>
            <Stack alignHorizontal="left" gap="16px">
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
            </Stack>
            <Stack alignHorizontal="center" gap="16px">
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
            </Stack>
            <Stack alignHorizontal="right" gap="16px">
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
              <Box
                backgroundColor="primary / 0.2"
                style={{ width: 40, height: 40 }}
              />
            </Stack>
          </Stack>
        </Box>
        <Box
          backgroundColor="surface"
          margin="-24px"
          borderRadius="12px"
          padding="24px"
        >
          <Stack gap="24px">
            <Text weight="medium" size="22px">
              Text
            </Text>
            <Box display="flex" gap="8px">
              <Stack gap="12px">
                <Text weight="light" size="11px">
                  11px light
                </Text>
                <Text weight="regular" size="11px">
                  11px regular
                </Text>
                <Text weight="medium" size="11px">
                  11px medium
                </Text>
                <Text weight="semibold" size="11px">
                  11px semibold
                </Text>
                <Text weight="bold" size="11px">
                  11px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="12px">
                  12px light
                </Text>
                <Text weight="regular" size="12px">
                  12px regular
                </Text>
                <Text weight="medium" size="12px">
                  12px medium
                </Text>
                <Text weight="semibold" size="12px">
                  12px semibold
                </Text>
                <Text weight="bold" size="12px">
                  12px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="14px">
                  14px light
                </Text>
                <Text weight="regular" size="14px">
                  14px regular
                </Text>
                <Text weight="medium" size="14px">
                  14px medium
                </Text>
                <Text weight="semibold" size="14px">
                  14px semibold
                </Text>
                <Text weight="bold" size="14px">
                  14px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="15px">
                  15px light
                </Text>
                <Text weight="regular" size="15px">
                  15px regular
                </Text>
                <Text weight="medium" size="15px">
                  15px medium
                </Text>
                <Text weight="semibold" size="15px">
                  15px semibold
                </Text>
                <Text weight="bold" size="15px">
                  15px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="18px">
                  18px light
                </Text>
                <Text weight="regular" size="18px">
                  18px regular
                </Text>
                <Text weight="medium" size="18px">
                  18px medium
                </Text>
                <Text weight="semibold" size="18px">
                  18px semibold
                </Text>
                <Text weight="bold" size="18px">
                  18px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="20px">
                  20px light
                </Text>
                <Text weight="regular" size="20px">
                  20px regular
                </Text>
                <Text weight="medium" size="20px">
                  20px medium
                </Text>
                <Text weight="semibold" size="20px">
                  20px semibold
                </Text>
                <Text weight="bold" size="20px">
                  20px bold
                </Text>
              </Stack>
            </Box>
            <Box display="flex" gap="8px">
              <Stack gap="12px">
                <Text weight="light" size="22px">
                  22px light
                </Text>
                <Text weight="regular" size="22px">
                  22px regular
                </Text>
                <Text weight="medium" size="22px">
                  22px medium
                </Text>
                <Text weight="semibold" size="22px">
                  22px semibold
                </Text>
                <Text weight="bold" size="22px">
                  22px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="26px">
                  26px light
                </Text>
                <Text weight="regular" size="26px">
                  26px regular
                </Text>
                <Text weight="medium" size="26px">
                  26px medium
                </Text>
                <Text weight="semibold" size="26px">
                  26px semibold
                </Text>
                <Text weight="bold" size="26px">
                  26px bold
                </Text>
              </Stack>
              <Stack gap="12px">
                <Text weight="light" size="32px">
                  32px light
                </Text>
                <Text weight="regular" size="32px">
                  32px regular
                </Text>
                <Text weight="medium" size="32px">
                  32px medium
                </Text>
                <Text weight="semibold" size="32px">
                  32px semibold
                </Text>
                <Text weight="bold" size="32px">
                  32px bold
                </Text>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
