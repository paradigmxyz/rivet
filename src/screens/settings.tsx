import { Container } from '~/components'
import { Box, Inline, Inset, Stack, Text } from '~/design-system'
import { useSettingsStore } from '~/zustand'

export default function Settings() {
  const {
    bypassConnectAuth,
    bypassSignatureAuth,
    bypassTransactionAuth,
    setBypassConnectAuth,
    setBypassSignatureAuth,
    setBypassTransactionAuth,
  } = useSettingsStore()

  return (
    <Container dismissable fit header="Settings">
      <Stack gap="16px">
        <Text color="text/tertiary">Cheats</Text>
        <Inset right="4px">
          <Stack gap="8px">
            <Inline
              alignVertical="center"
              alignHorizontal="justify"
              wrap={false}
            >
              <Box as="label" htmlFor="instant-auth" width="full">
                <Text size="12px">Bypass Connect Authorization</Text>
              </Box>
              {/** TODO: <Checkbox> component */}
              <Box
                as="input"
                id="instant-auth"
                checked={bypassConnectAuth}
                onChange={(e) => {
                  setBypassConnectAuth(e.target.checked)
                }}
                type="checkbox"
              />
            </Inline>
            <Inline
              alignVertical="center"
              alignHorizontal="justify"
              wrap={false}
            >
              <Box as="label" htmlFor="instant-auth" width="full">
                <Text size="12px">Bypass Signature Authorization</Text>
              </Box>
              {/** TODO: <Checkbox> component */}
              <Box
                as="input"
                id="instant-auth"
                checked={bypassSignatureAuth}
                onChange={(e) => {
                  setBypassSignatureAuth(e.target.checked)
                }}
                type="checkbox"
              />
            </Inline>
            <Inline
              alignVertical="center"
              alignHorizontal="justify"
              wrap={false}
            >
              <Box as="label" htmlFor="instant-auth" width="full">
                <Text size="12px">Bypass Transaction Authorization</Text>
              </Box>
              {/** TODO: <Checkbox> component */}
              <Box
                as="input"
                id="instant-auth"
                checked={bypassTransactionAuth}
                onChange={(e) => {
                  setBypassTransactionAuth(e.target.checked)
                }}
                type="checkbox"
              />
            </Inline>
          </Stack>
        </Inset>
      </Stack>
    </Container>
  )
}
