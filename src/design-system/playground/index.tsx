import '../../hmr'

import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import '~/design-system/styles/global.css'

import {
  AccentColorProvider,
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  Inset,
  Link,
  Row,
  Rows,
  SFSymbol,
  Separator,
  Stack,
  Text,
  type Theme,
  ThemeProvider,
} from '~/design-system'

function DesignSystem() {
  const [theme, setTheme] = useState<Theme>('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = newTheme
    setTheme(newTheme)
  }

  return (
    <HashRouter>
      <Box
        backgroundColor="surface/primary"
        marginHorizontal="auto"
        maxWidth="1152px"
        paddingTop="40px"
      >
        <Box
          as="button"
          onClick={toggleTheme}
          style={{ fontSize: 48, position: 'fixed', left: 16 }}
        >
          {theme === 'dark' ? '🌞' : '🌝'}
        </Box>
        <Stack gap="72px">
          <Text weight="semibold" size="32px">
            Design System
          </Text>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Color System
              </Text>
              <Box backgroundColor="surface/primary" padding="8px">
                <Stack gap="8px">
                  <Box
                    backgroundColor="surface/primary"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Primary</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/primary/elevated"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Primary / Elevated</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/secondary"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Secondary</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/secondary/elevated"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Secondary / Elevated</Text>
                  </Box>
                  <Box backgroundColor="surface/fill" hoverable padding="20px">
                    <Text>Surface / Fill</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/fill/secondary"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Fill / Secondary</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/fill/tertiary"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Fill / Tertiary</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/fill/quarternary"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Fill / Quarternary</Text>
                  </Box>
                  <Box backgroundColor="surface/blue" hoverable padding="20px">
                    <Text>Surface / Blue</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/blueTint"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Blue Tint</Text>
                  </Box>
                  <Box backgroundColor="surface/green" hoverable padding="20px">
                    <Text>Surface / Green</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/greenTint"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Green Tint</Text>
                  </Box>
                  <Box backgroundColor="surface/red" hoverable padding="20px">
                    <Text>Surface / Red</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/redTint"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Red Tint</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/yellow"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Yellow</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/yellowTint"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Yellow Tint</Text>
                  </Box>
                  <Box
                    backgroundColor="surface/invert"
                    hoverable
                    padding="20px"
                  >
                    <Text>Surface / Invert</Text>
                  </Box>
                  <Box backgroundColor="surface/white" hoverable padding="20px">
                    <Text>Surface / White</Text>
                  </Box>
                  <Box backgroundColor="surface/black" hoverable padding="20px">
                    <Text>Surface / Black</Text>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
                  Contextual Inheritance
                </Text>
                <Box backgroundColor="surface/white" padding="8px">
                  <Text>White Context</Text>
                  <Box style={{ height: 10 }} />
                  <Box backgroundColor="surface/primary" padding="8px">
                    <Text>Surface / Primary Context</Text>
                    <Box style={{ height: 10 }} />
                    <Box backgroundColor="surface/black" padding="8px">
                      <Text>Black Context</Text>
                      <Box style={{ height: 10 }} />
                      <Box
                        backgroundColor="surface/secondary/elevated"
                        padding="8px"
                      >
                        <Text>Surface / Secondary / Elevated Context</Text>
                      </Box>
                    </Box>
                  </Box>
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
                  <Box backgroundColor="surface/primary" padding="8px">
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
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Bleed
              </Text>
              <Box backgroundColor="surface/primary">
                <Bleed space="-8px">
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 50 }}
                  />
                </Bleed>
              </Box>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
                  <Button variant="solid invert" width="fit">
                    Button
                  </Button>
                  <Button variant="solid primary" width="fit">
                    Button
                  </Button>
                  <Button variant="solid fill" width="fit">
                    Button
                  </Button>
                  <Button variant="solid blue" width="fit">
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
                  <Button variant="stroked fill" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked invert" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked blue" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked red" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked green" width="fit">
                    Button
                  </Button>
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Tint
                </Text>
                <Box display="flex" gap="8px">
                  <Button variant="tint blue" width="fit">
                    Button
                  </Button>
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
                  Ghost
                </Text>
                <Box display="flex" gap="8px">
                  <Button variant="ghost primary" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost blue" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost green" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost red" width="fit">
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
                  <Button variant="stroked invert" height="44px" width="fit">
                    Button
                  </Button>
                  <Button variant="tint green" height="44px" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost primary" height="44px" width="fit">
                    Button
                  </Button>
                </Box>
                <Box display="flex" gap="8px">
                  <Button height="36px" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked invert" height="36px" width="fit">
                    Button
                  </Button>
                  <Button variant="tint green" height="36px" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost primary" height="36px" width="fit">
                    Button
                  </Button>
                </Box>
                <Box display="flex" gap="8px">
                  <Button height="24px" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked invert" height="24px" width="fit">
                    Button
                  </Button>
                  <Button variant="tint green" height="24px" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost primary" height="24px" width="fit">
                    Button
                  </Button>
                </Box>
                <Box display="flex" gap="8px">
                  <Button height="20px" width="fit">
                    Button
                  </Button>
                  <Button variant="stroked invert" height="20px" width="fit">
                    Button
                  </Button>
                  <Button variant="tint green" height="20px" width="fit">
                    Button
                  </Button>
                  <Button variant="ghost primary" height="20px" width="fit">
                    Button
                  </Button>
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Disabled
                </Text>
                <Box display="flex" gap="8px">
                  <Button disabled height="44px" width="fit">
                    Button
                  </Button>
                  <Button
                    disabled
                    variant="stroked invert"
                    height="44px"
                    width="fit"
                  >
                    Button
                  </Button>
                  <Button
                    disabled
                    variant="tint green"
                    height="44px"
                    width="fit"
                  >
                    Button
                  </Button>
                  <Button
                    disabled
                    variant="ghost primary"
                    height="44px"
                    width="fit"
                  >
                    Button
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Button.Symbol
              </Text>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Solid
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol symbol="trash" />
                  <Button.Symbol symbol="trash" variant="solid primary" />
                  <Button.Symbol symbol="trash" variant="solid fill" />
                  <Button.Symbol symbol="trash" variant="solid blue" />
                  <Button.Symbol symbol="trash" variant="solid green" />
                  <Button.Symbol symbol="trash" variant="solid red" />
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Stroked
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol symbol="trash" variant="stroked fill" />
                  <Button.Symbol symbol="trash" variant="stroked invert" />
                  <Button.Symbol symbol="trash" variant="stroked blue" />
                  <Button.Symbol symbol="trash" variant="stroked green" />
                  <Button.Symbol symbol="trash" variant="stroked red" />
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Tint
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol symbol="trash" variant="tint blue" />
                  <Button.Symbol symbol="trash" variant="tint green" />
                  <Button.Symbol symbol="trash" variant="tint red" />
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Ghost
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol symbol="trash" variant="ghost primary" />
                  <Button.Symbol symbol="trash" variant="ghost blue" />
                  <Button.Symbol symbol="trash" variant="ghost green" />
                  <Button.Symbol symbol="trash" variant="ghost red" />
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Height
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol height="44px" symbol="trash" />
                  <Button.Symbol
                    height="44px"
                    symbol="trash"
                    variant="stroked invert"
                  />
                  <Button.Symbol
                    height="44px"
                    symbol="trash"
                    variant="tint green"
                  />
                  <Button.Symbol
                    height="44px"
                    symbol="trash"
                    variant="ghost red"
                  />
                </Box>
                <Box display="flex" gap="8px">
                  <Button.Symbol height="36px" symbol="trash" />
                  <Button.Symbol
                    height="36px"
                    symbol="trash"
                    variant="stroked invert"
                  />
                  <Button.Symbol
                    height="36px"
                    symbol="trash"
                    variant="tint green"
                  />
                  <Button.Symbol
                    height="36px"
                    symbol="trash"
                    variant="ghost red"
                  />
                </Box>
                <Box display="flex" gap="8px">
                  <Button.Symbol height="24px" symbol="trash" />
                  <Button.Symbol
                    height="24px"
                    symbol="trash"
                    variant="stroked invert"
                  />
                  <Button.Symbol
                    height="24px"
                    symbol="trash"
                    variant="tint green"
                  />
                  <Button.Symbol
                    height="24px"
                    symbol="trash"
                    variant="ghost red"
                  />
                </Box>
                <Box display="flex" gap="8px">
                  <Button.Symbol height="20px" symbol="trash" />
                  <Button.Symbol
                    height="20px"
                    symbol="trash"
                    variant="stroked invert"
                  />
                  <Button.Symbol
                    height="20px"
                    symbol="trash"
                    variant="tint green"
                  />
                  <Button.Symbol
                    height="20px"
                    symbol="trash"
                    variant="ghost red"
                  />
                </Box>
              </Stack>
              <Stack gap="16px">
                <Text weight="medium" size="18px">
                  Disabled
                </Text>
                <Box display="flex" gap="8px">
                  <Button.Symbol disabled symbol="trash" />
                  <Button.Symbol
                    disabled
                    symbol="trash"
                    variant="stroked invert"
                  />
                  <Button.Symbol disabled symbol="trash" variant="tint green" />
                  <Button.Symbol
                    disabled
                    symbol="trash"
                    variant="ghost primary"
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Columns
              </Text>
              <Columns gap="12px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 100 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 100 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 100 }}
                />
              </Columns>
              <Columns gap="12px">
                <Column width="1/4">
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 100 }}
                  />
                </Column>
                <Column width="1/3">
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 100 }}
                  />
                </Column>
                <Column>
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 100 }}
                  />
                </Column>
              </Columns>
              <Columns gap="12px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 100 }}
                />
                <Column width="content">
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 100, width: 100 }}
                  />
                </Column>
              </Columns>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 50, width: 50 }}
                />
              </Inline>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Input
              </Text>
              <Input placeholder="Enter your email..." />
              <Input
                data-invalid
                defaultValue="invalid value"
                placeholder="Enter your email..."
              />
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Inset
              </Text>
              <Box backgroundColor="surface/primary">
                <Inset space="24px">
                  <Box
                    backgroundColor="surface/invert@0.2"
                    style={{ height: 50 }}
                  />
                </Inset>
              </Box>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Link
              </Text>
              <Link to="/lol">Internal link</Link>
              <Link external href="https://google.com">
                External link
              </Link>
              <Text>
                This is an inline{' '}
                <Link external href="https://google.com">
                  external link
                </Link>
              </Text>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
                  <Box backgroundColor="surface/invert@0.2" flex="1" />
                  <Box backgroundColor="surface/invert@0.2" flex="1" />
                  <Box backgroundColor="surface/invert@0.2" flex="1" />
                </Rows>
              </Box>
              <Box style={{ height: 300 }}>
                <Rows gap="12px">
                  <Row height="1/4">
                    <Box backgroundColor="surface/invert@0.2" flex="1" />
                  </Row>
                  <Row height="1/4">
                    <Box backgroundColor="surface/invert@0.2" flex="1" />
                  </Row>
                  <Row>
                    <Box backgroundColor="surface/invert@0.2" flex="1" />
                  </Row>
                </Rows>
              </Box>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                SFSymbol
              </Text>
              <Box display="flex" gap="8px">
                <SFSymbol symbol="person.circle" size="32px" />
                <SFSymbol symbol="wallet.pass" size="32px" />
              </Box>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
            margin="-24px"
            borderRadius="12px"
            padding="24px"
          >
            <Stack gap="24px">
              <Text weight="medium" size="22px">
                Stack
              </Text>
              <Stack gap="16px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ height: 40 }}
                />
              </Stack>
              <Stack alignHorizontal="left" gap="16px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
              </Stack>
              <Stack alignHorizontal="center" gap="16px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
              </Stack>
              <Stack alignHorizontal="right" gap="16px">
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
                <Box
                  backgroundColor="surface/invert@0.2"
                  style={{ width: 40, height: 40 }}
                />
              </Stack>
            </Stack>
          </Box>
          <Box
            backgroundColor="surface/primary/elevated"
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
              <Text>
                This is some <Text color="surface/blue">inline text</Text>.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <DesignSystem />,
)
