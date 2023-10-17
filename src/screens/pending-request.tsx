import * as Tabs from '@radix-ui/react-tabs'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { omitBy } from 'remeda'
import {
  type Address,
  BaseError,
  type Hex,
  type TransactionRequest,
  formatEther,
  formatGwei,
  formatTransaction,
  formatTransactionRequest,
  hexToString,
  isHex,
  numberToHex,
  parseEther,
  parseGwei,
} from 'viem'

import {
  Container,
  DecodedCalldata,
  LabelledContent,
  Popover,
  TabsContent,
  TabsList,
  Tooltip,
} from '~/components'
import { InputField } from '~/components/form'
import {
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Inset,
  Stack,
  Text,
} from '~/design-system'
import {
  type UsePrepareTransactionRequestParameters,
  usePrepareTransactionRequest,
} from '~/hooks/usePrepareTransactionRequest'
import { getMessenger } from '~/messengers'
import { useAccountStore, usePendingRequestsStore } from '~/zustand'
import type { PendingRequest } from '~/zustand/pending-requests'

const backgroundMessenger = getMessenger('background:wallet')

export default function PendingRequest_({
  request,
}: { request: PendingRequest }) {
  if (request.method === 'eth_sendTransaction')
    return <SendTransactionRequest request={request} />
  if (request.method === 'personal_sign')
    return <SignMessageRequest request={request} />
  if (request.method === 'eth_signTypedData_v4')
    return <SignTypedDataRequest request={request} />
  if (request.method === 'eth_requestAccounts') {
    return <RequestAccounts request={request} />
  }
  return null
}

function PendingRequestContainer({
  children,
  header = 'Pending Request',
  isLoading,
  onApprove,
  onReject,
}: {
  children: React.ReactNode
  header?: string
  isLoading?: boolean
  onApprove(): void
  onReject(): void
}) {
  return (
    <Container
      header={header}
      footer={
        <Inline gap="12px" wrap={false}>
          <Button disabled={isLoading} onClick={onReject} variant="tint red">
            Reject
          </Button>
          <Button disabled={isLoading} onClick={onApprove} variant="tint green">
            Approve
          </Button>
        </Inline>
      }
    >
      <Stack gap="32px">{children}</Stack>
    </Container>
  )
}

////////////////////////////////////////////////////////////////////////
// Detail Components

const numberIntl = new Intl.NumberFormat()
const numberIntl8SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 8,
})

type ExtractRequest<Method extends string> = Extract<
  PendingRequest,
  { method: Method }
>

function SendTransactionRequest(args: {
  request: ExtractRequest<'eth_sendTransaction'>
}) {
  // Format transaction request from RPC format (hex) into readable format (bigint, etc).
  const transactionRequest = useMemo(
    () => formatTransaction(args.request.params[0]) as TransactionRequest,
    [args.request.params],
  )

  // Prepare the transaction request for signing (populate gas estimate, fees, etc if non-existent).
  const { account: account_ } = useAccountStore()
  const {
    data: preparedRequest,
    error,
    isLoading,
  } = usePrepareTransactionRequest({
    ...transactionRequest,
    account: account_,
  } as unknown as UsePrepareTransactionRequestParameters)

  const request = preparedRequest || transactionRequest || {}
  const {
    from,
    to,
    nonce,
    maxFeePerGas,
    maxPriorityFeePerGas,
    value,
    gas,
    data,
  } = request

  ////////////////////////////////////////////////////////////////////////

  const handleApprove = async () => {
    // Serialize the transaction request into RPC format (hex).
    const txRequest = formatTransactionRequest(request)
    const params = [omitBy(txRequest, (value) => !isHex(value))]

    await backgroundMessenger.send('pendingRequest', {
      request: { ...args.request, params: params as any },
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request: args.request,
      status: 'rejected',
    })
  }

  type FormValues = {
    data: Hex;
    from: Address;
    gas: Hex;
    maxFeePerGas: Hex;
    maxPriorityFeePerGas: Hex;
    nonce: Hex;
    to: Address;
    value: Hex;
  }

  const { updatePendingRequest } = usePendingRequestsStore();
  const { formState, handleSubmit, register } = useForm<FormValues>()

  const handleUpdate = (formData: FormValues) => {

    const updatedData = formData.data || data
    const updatedFrom = formData.from || from
    const updatedGas = formData.gas || gas
    const updatedMaxFeePerGas = formData.maxFeePerGas || (typeof maxFeePerGas === 'bigint' ? formatGwei(maxFeePerGas) : undefined)
    const updatedMaxPriorityFeePerGas =
      (formData.maxPriorityFeePerGas) || (typeof maxPriorityFeePerGas === 'bigint' ? formatGwei(maxPriorityFeePerGas) : undefined)
    const updatedNonce = formData.nonce || nonce
    const updatedTo = formData.to || (to ? to : "0x0000000000000000000000000000000000000000")
    const updatedValue = formData.value || (typeof value === 'bigint' ? formatEther(value) : undefined) 

    const updatedRequest = {
      ...args.request,
      params: [{
        data: updatedData,
        from: updatedFrom,
        gas: updatedGas.toString(),
        maxFeePerGas: updatedMaxFeePerGas
          ? numberToHex(parseGwei(updatedMaxFeePerGas))
          : undefined,
        maxPriorityFeePerGas: 
          updatedMaxPriorityFeePerGas
          ? numberToHex(parseGwei(updatedMaxPriorityFeePerGas))
          : undefined,
        nonce: updatedNonce.toString(),
        to: updatedTo,
        value: updatedValue ? numberToHex(parseEther(updatedValue)) : undefined,
      }]
    } as PendingRequest

    updatePendingRequest(updatedRequest)
  }

  const submit = handleSubmit(handleUpdate)

  ////////////////////////////////////////////////////////////////////////

  const [tab, setTab] = useState('data')

  ////////////////////////////////////////////////////////////////////////

  return (
    <PendingRequestContainer
      header="Transaction Request"
      isLoading={isLoading}
      onApprove={handleApprove}
      onReject={handleReject}
    >
      <Stack gap="20px">
        {error && (
          <Box backgroundColor="surface/yellowTint" padding="8px">
            <Stack gap="12px">
              <Text size="11px">
                An error occurred while simulating transaction execution. This
                transaction will unlikely succeed.
              </Text>
              {error instanceof BaseError && (
                <>
                  <Text size="11px">Reason: {error.shortMessage}</Text>
                  <Text size="11px">Details: {error.details}</Text>
                </>
              )}
            </Stack>
          </Box>
        )}
        <Columns gap="12px">
          <Column width="1/3">
            <LabelledContent 
              label="From"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={from} 
                    label="From"
                    placeholder="from"
                    register={register('from', {
                      pattern: /^0x[a-fA-F0-9]+$/
                    })}
                    style={{width: "360px"}}
                  />
                </Popover.Form>
              }
            >
              <Tooltip label={from}>
                <Text.Truncated size="12px">{from}</Text.Truncated>
              </Tooltip>
            </LabelledContent>
          </Column>
          <Column width="1/3">
            <LabelledContent 
              label="To"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField 
                    defaultValue={to} 
                    label="To"
                    placeholder="to"
                    register={register('to', {
                      pattern: /^0x[a-fA-F0-9]+$/
                    })}
                    style={{width: "360px"}}
                  />
                </Popover.Form>
              }
            >
              <Tooltip label={to}>
                <Text.Truncated size="12px">{to}</Text.Truncated>
              </Tooltip>
            </LabelledContent>
          </Column>
          <Column width="1/3">
            <LabelledContent 
              label="Value"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={typeof value === 'bigint' ?
                    numberIntl8SigFigs.format(
                      Number(formatEther(value)),
                    ) : ''}
                    label="Value"
                    placeholder="value"
                    register={register('value', {
                      min: 0,
                    })}
                    type="number"
                  />
                </Popover.Form>
              }
            >
              <Text size="12px">
                {typeof value === 'bigint' &&
                  `${numberIntl8SigFigs.format(
                    Number(formatEther(value)),
                  )} ETH`}
              </Text>
            </LabelledContent>
          </Column>
        </Columns>
        <Columns gap="12px">
          <Column width="1/3">
            <LabelledContent 
              label="Gas Limit"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={typeof gas === 'bigint' ?
                      gas.toString() : ''}
                    label="Gas Limit"
                    placeholder="gas"
                    register={register('gas', {
                      min: 0
                    })}
                    type="number"
                  />
                </Popover.Form>
              }
            >
              <Text size="12px">
                {typeof gas === 'bigint' && numberIntl.format(gas)}
              </Text>
            </LabelledContent>
          </Column>
          <Column width="1/3">
            <LabelledContent 
              label="Tip Per Gas"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={typeof maxPriorityFeePerGas === 'bigint' ?
                      numberIntl8SigFigs.format(
                        Number(formatGwei(maxPriorityFeePerGas)),
                      ) : ''
                    }
                    label="Tip Per Gas"
                    placeholder="maxPriorityFeePerGas"
                    register={register('maxPriorityFeePerGas', {
                      min: 0
                    })}
                  />
                </Popover.Form>
              }
            >
              <Text size="12px">
                {typeof maxPriorityFeePerGas === 'bigint' && (
                  <>
                    {numberIntl8SigFigs.format(
                      Number(formatGwei(maxPriorityFeePerGas)),
                    )}{' '}
                    <Text color="text/tertiary">gwei</Text>
                  </>
                )}
              </Text>
            </LabelledContent>
          </Column>
          <Column width="1/3">
            <LabelledContent 
              label="Max Fee Per Gas"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={typeof maxFeePerGas === 'bigint' ?
                      numberIntl8SigFigs.format(
                        Number(formatGwei(maxFeePerGas)),
                      ) : ''
                    }
                    label="Max Fee Per Gas" 
                    placeholder="maxFeePerGas"
                    register={register('maxFeePerGas', {
                      min: 0
                    })}
                  />
                </Popover.Form>
              }
            >
              <Text size="12px">
                {typeof maxFeePerGas === 'bigint' && (
                  <>
                    {numberIntl8SigFigs.format(
                      Number(formatGwei(maxFeePerGas)),
                    )}{' '}
                    <Text color="text/tertiary">gwei</Text>
                  </>
                )}
              </Text>
            </LabelledContent>
          </Column>
        </Columns>
        <Columns gap="12px">
          <Column>
            <LabelledContent 
              label="Nonce"
              labelButton={
                <Popover.Form 
                  isValid={formState.isValid} 
                  onSubmit={submit}
                >
                  <InputField
                    defaultValue={nonce} 
                    label="Nonce"
                    placeholder="nonce"
                    register={register('nonce', {
                      min: 0
                    })}
                    type="number"
                  />
                </Popover.Form>
              }
            >
              <Text size="12px">{nonce}</Text>
            </LabelledContent>
          </Column>
        </Columns>
          <Tabs.Root asChild value={tab}>
            <Box display="flex" flexDirection="column" height="full">
              <TabsList
                items={[
                  { label: 'Data', value: 'data' },
                  { label: 'Trace', value: 'trace' },
                ]}
                onSelect={(item) => {
                  setTab(item.value)
                }}
              />
              <Inset vertical="16px" bottom="152px">
                <TabsContent inset={false} scrollable={false} value="data">
                  <Box display="flex" flexDirection="row" alignItems="center">
                  <DecodedCalldata 
                    address={to} 
                    data={data || "0x"} 
                    labelButton={
                      <Popover.Form 
                        isValid={formState.isValid} 
                        onSubmit={submit}
                      >
                        <InputField
                          defaultValue={data || "0x"} 
                          label="Raw Data"
                          placeholder="data"
                          register={register('data', {
                            pattern: /^0x[a-fA-F0-9]*$/
                          })}
                          style={{width: "360px"}}
                        />
                      </Popover.Form>
                    }
                  />
                  </Box>
                </TabsContent>
                <TabsContent inset={false} value="state">
                  {''}
                </TabsContent>
              </Inset>
            </Box>
          </Tabs.Root>
      </Stack>
    </PendingRequestContainer>
  )
}

function RequestAccounts({
  request,
}: {
  request: ExtractRequest<'eth_requestAccounts'>
}) {
  const handleApprove = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'approved',
    })
  }
  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'rejected',
    })
  }

  const host = request.sender?.origin
    ? new URL(request.sender.origin).hostname.replace('www.', '')
    : undefined

  return (
    <PendingRequestContainer
      header="Connection Request"
      onApprove={handleApprove}
      onReject={handleReject}
    >
      <Stack gap="20px">
        <Text color="text/secondary" size="14px">
          The application{' '}
          <Text color="text" weight="medium">
            {host}
          </Text>{' '}
          wants to connect to your wallet.
        </Text>
        <Text color="text/secondary" size="14px">
          By approving this request, this application will be able to view your
          account addresses, balances, and request approval for transactions or
          signatures.
        </Text>
      </Stack>
    </PendingRequestContainer>
  )
}

function SignMessageRequest({
  request,
}: {
  request: ExtractRequest<'personal_sign'>
}) {
  const [data, address] = request.params

  const handleApprove = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'rejected',
    })
  }

  return (
    <PendingRequestContainer
      header="Sign Message Request"
      onApprove={handleApprove}
      onReject={handleReject}
    >
      <Stack gap="20px">
        <Columns gap="12px">
          <Column width="1/4">
            <LabelledContent label="Address">
              <Tooltip label={address}>
                <Text.Truncated size="12px">{address}</Text.Truncated>
              </Tooltip>
            </LabelledContent>
          </Column>
        </Columns>
        <Columns gap="12px">
          <Column>
            <LabelledContent label="Message">
              <Text size="12px">{hexToString(data)}</Text>
            </LabelledContent>
          </Column>
        </Columns>
      </Stack>
    </PendingRequestContainer>
  )
}

function SignTypedDataRequest({
  request,
}: {
  request: ExtractRequest<'eth_signTypedData_v4'>
}) {
  const [address, data] = request.params

  const handleApprove = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'rejected',
    })
  }

  return (
    <PendingRequestContainer
      header="Sign Typed Data Request"
      onApprove={handleApprove}
      onReject={handleReject}
    >
      <Stack gap="20px">
        <Columns gap="12px">
          <Column width="1/4">
            <LabelledContent label="Address">
              <Tooltip label={address}>
                <Text.Truncated size="12px">{address}</Text.Truncated>
              </Tooltip>
            </LabelledContent>
          </Column>
        </Columns>
        <Columns gap="12px">
          <Column>
            <LabelledContent label="Message">
              <Text as="pre" size="12px">
                {JSON.stringify(JSON.parse(data), null, 2)}
              </Text>
            </LabelledContent>
          </Column>
        </Columns>
      </Stack>
    </PendingRequestContainer>
  )
}
