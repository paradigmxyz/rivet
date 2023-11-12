import * as Tabs from '@radix-ui/react-tabs'
import { useMutation } from '@tanstack/react-query'
import type { Abi, AbiFunction } from 'abitype'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import {
  AbiFunctionsAccordion,
  Container,
  FormPopover,
  LabelledContent,
  TabsContent,
  TabsList,
} from '~/components'
import * as Form from '~/components/form'
import { Bleed, Box, Stack, Text } from '~/design-system'
import { useAutoloadAbi } from '~/hooks/useAutoloadAbi'
import { useContracts } from '~/hooks/useContracts'

export default function ContractDetails() {
  const { contractAddress } = useParams()
  const { contracts, updateContract } = useContracts({ enabled: false })
  const contract = contracts.find((c) => c.address === contractAddress)

  ////////////////////////////////////////////////////////////////////////

  const { formState, register, handleSubmit } = useForm({
    defaultValues: { name: contract?.name },
  })

  const update = handleSubmit(({ name }) => {
    updateContract({ address: contract?.address!, name })
  })

  ////////////////////////////////////////////////////////////////////////

  const { data: autoloadAbi, isLoading } = useAutoloadAbi({
    address: contract?.address,
    enabled: Boolean(!contract?.abi && contract?.address),
  })

  const abi = (contract?.abi || autoloadAbi) as Abi

  const abiFunctions = useMemo(() => {
    if (!abi) return undefined
    return abi
      .filter((abiItem) => abiItem.type === 'function')
      .map((abiItem) => ({
        ...abiItem,
        inputs: (abiItem as {} as AbiFunction).inputs || [],
        outputs: (abiItem as {} as AbiFunction).outputs || [],
      })) as {} as AbiFunction[]
  }, [abi])

  const hasStateMutability = !abiFunctions?.some(
    (abiItem) => !('stateMutability' in abiItem),
  )

  const isGuessedAbi = !hasStateMutability

  const [readAbi, writeAbi] = useMemo(() => {
    if (!abiFunctions) return [undefined, undefined]
    if (!hasStateMutability) return [undefined, undefined]
    const read = abiFunctions.filter(
      (abiItem) =>
        'stateMutability' in abiItem &&
        (abiItem.stateMutability === 'pure' ||
          abiItem.stateMutability === 'view'),
    )
    const write = abiFunctions.filter(
      (abiItem) =>
        'stateMutability' in abiItem &&
        (abiItem.stateMutability === 'nonpayable' ||
          abiItem.stateMutability === 'payable'),
    )
    return [read as {} as AbiFunction[], write as {} as AbiFunction[]]
  }, [abiFunctions, hasStateMutability])

  ////////////////////////////////////////////////////////////////////////

  return (
    <Container dismissable header="Contract Details">
      <Stack gap="20px">
        <LabelledContent
          label="Label"
          labelRight={
            <FormPopover disabled={!formState.isValid} onSubmit={update}>
              <Form.InputField
                label="Label"
                height="24px"
                hideLabel
                register={register('name', {
                  required: true,
                })}
                style={{ width: '360px' }}
              />
            </FormPopover>
          }
        >
          <Text size="12px">{contract?.name ?? 'Unnamed Contract'}</Text>
        </LabelledContent>
        <LabelledContent label="Contract Address">
          <Text size="12px">{contract?.address}</Text>
        </LabelledContent>
        {(isGuessedAbi || contract?.abi) && (
          <UploadAbi
            onUpload={({ abi, file }) =>
              updateContract({
                abi,
                address: contract?.address!,
                name: file.name.replace('.json', ''),
              })
            }
          />
        )}
        {isGuessedAbi && (
          <>
            <Box backgroundColor="surface/yellowTint" padding="8px">
              <Text size="11px">
                Warning: We could not accurately extract the ABI for this
                contract. The methods below are a best guess based on the
                selectors in the bytecode. It is recommended to upload the ABI
                using the button above.
              </Text>
            </Box>
          </>
        )}
        {isLoading && (
          <Text color="text/tertiary" size="12px">
            Loading...
          </Text>
        )}
        {abi && (
          <Tabs.Root asChild defaultValue="read">
            <Box display="flex" flexDirection="column" height="full">
              {hasStateMutability ? (
                <>
                  <TabsList
                    items={[
                      { label: 'Read', value: 'read' },
                      { label: 'Write', value: 'write' },
                    ]}
                  />
                  <TabsContent value="read">
                    <Bleed horizontal="-8px">
                      {contract?.address && readAbi && (
                        <AbiFunctionsAccordion
                          abi={readAbi}
                          address={contract?.address}
                        />
                      )}
                    </Bleed>
                  </TabsContent>
                  <TabsContent value="write">
                    <Bleed horizontal="-8px">
                      {contract?.address && writeAbi && (
                        <AbiFunctionsAccordion
                          abi={writeAbi}
                          address={contract?.address}
                        />
                      )}
                    </Bleed>
                  </TabsContent>
                </>
              ) : (
                <>
                  {contract?.address && abiFunctions && (
                    <Bleed horizontal="-8px">
                      <AbiFunctionsAccordion
                        abi={abiFunctions}
                        address={contract?.address}
                      />
                    </Bleed>
                  )}
                </>
              )}
            </Box>
          </Tabs.Root>
        )}
      </Stack>
    </Container>
  )
}

function UploadAbi({
  onUpload,
}: { onUpload: (abi: { abi: Abi; file: File }) => void }) {
  const { error, mutateAsync: uploadAbi } = useMutation({
    async mutationFn(files: FileList | null) {
      if (!files) return
      const file = files[0]
      const json = JSON.parse(await file.text()) as any
      const abi = json.abi || json

      const isAbi = (() => {
        if (!Array.isArray(abi)) return false
        if (!abi.every((abiItem: any) => 'type' in abiItem)) return false
        return true
      })()
      if (!isAbi)
        throw new Error('ABI is not valid. Please upload a valid ABI.')

      onUpload({ abi, file })
    },
  })

  return (
    <Stack gap="8px">
      <LabelledContent label="Upload ABI">
        <input
          accept=".json"
          onChange={(e) => uploadAbi(e.target.files)}
          type="file"
        />
      </LabelledContent>
      {error && (
        <Text color="surface/red" size="11px">
          {error.message}
        </Text>
      )}
    </Stack>
  )
}
