import * as Accordion from '@radix-ui/react-accordion'
import * as Tabs from '@radix-ui/react-tabs'
import { type ReactElement, cloneElement, useMemo, useState } from 'react'
import {
  type FieldValues,
  type RegisterOptions,
  useForm,
} from 'react-hook-form'
import { omitBy } from 'remeda'
import {
  BaseError,
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
  FormPopover,
  LabelledContent,
  TabsContent,
  TabsList,
  Tooltip,
} from '~/components'
import { FormattedAbiFunctionName } from '~/components/abi/FormattedAbiFunctionName'
import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Inset,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import {
  type GetPrepareTransactionRequestQueryOptionsParameters,
  usePrepareTransactionRequest,
  usePrepareTransactionRequests,
} from '~/hooks/usePrepareTransactionRequest'
import { getMessenger } from '~/messengers'
import { useAccountStore, usePendingRequestsStore } from '~/zustand'
import type { PendingRequest } from '~/zustand/pending-requests'

import * as styles from './pending-request.css'

const backgroundMessenger = getMessenger('background:wallet')

const numberIntl = new Intl.NumberFormat()
const numberIntl8SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 8,
})

type ExtractRequest<Method extends string> = Extract<
  PendingRequest,
  { method: Method }
>

export default function PendingRequest_({
  request,
}: { request: PendingRequest }) {
  if (request.method === 'wallet_sendCalls')
    return <SendCallsRequest request={request} />
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
// Send Calls View

function SendCallsRequest(args: {
  request: ExtractRequest<'wallet_sendCalls'>
}) {
  const params = args.request.params![0]

  // Prepare the transaction request for signing (populate gas estimate, fees, etc if non-existent).
  const { account } = useAccountStore()
  const calls = useMemo(
    () => params.calls.map((call) => formatTransaction(call)),
    [params.calls],
  )
  const preparedCallQueries = usePrepareTransactionRequests({
    requests: calls.map(
      (call) =>
        ({
          ...call,
          account: params.from ?? account,
        }) as GetPrepareTransactionRequestQueryOptionsParameters,
    ),
  })

  const { from, maxFeePerGas, maxPriorityFeePerGas } =
    preparedCallQueries[0].data || {}

  const isFetched = preparedCallQueries.every((query) => query.isFetched)
  const error = preparedCallQueries.find((query) => query.error)?.error

  const handleApprove = async () => {
    const serializedCalls = preparedCallQueries.map((query) =>
      formatTransactionRequest(query.data!),
    )
    await backgroundMessenger.send('pendingRequest', {
      request: {
        ...args.request,
        params: [
          {
            ...args.request.params![0],
            calls: serializedCalls as any,
          },
        ],
      },
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request: args.request,
      status: 'rejected',
    })
  }

  return (
    <PendingRequestContainer
      isLoading={!isFetched}
      header="Transaction Request"
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
            <LabelledContent label="From">
              <Tooltip label={from}>
                <Text.Truncated size="12px">{from}</Text.Truncated>
              </Tooltip>
            </LabelledContent>
          </Column>
          <Column width="1/3">
            <LabelledContent label="Max Fee Per Gas">
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
          <Column width="1/3">
            <LabelledContent label="Tip Per Gas">
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
        </Columns>
        <Tabs.Root asChild value="calls">
          <Box display="flex" flexDirection="column" height="full">
            <TabsList
              items={[
                { label: 'Calls', value: 'calls' },
                { label: 'Trace', value: 'trace' },
              ]}
            />
            <Inset vertical="0px">
              <TabsContent inset={false} scrollable={false} value="calls">
                <Bleed horizontal="-8px">
                  <Inset space="8px">
                    <Columns alignVertical="center" gap="8px">
                      <Column width="content">
                        <Box style={{ width: '100px' }}>
                          <Text color="text/tertiary" size="9px" wrap={false}>
                            TYPE
                          </Text>
                        </Box>
                      </Column>
                      <Column>
                        <Box style={{ width: '120px' }}>
                          <Text color="text/tertiary" size="9px" wrap={false}>
                            TO
                          </Text>
                        </Box>
                      </Column>
                      <Column alignHorizontal="right" alignVertical="center">
                        <Box style={{ paddingRight: '22px' }}>
                          <Text color="text/tertiary" size="9px" wrap={false}>
                            VALUE
                          </Text>
                        </Box>
                      </Column>
                    </Columns>
                  </Inset>
                  <Separator />
                  <Accordion.Root className={styles.root} type="multiple">
                    {preparedCallQueries.map((query, index) => {
                      const call = query.data
                      const isTransfer = !call?.data
                      return (
                        <Accordion.Item
                          key={index}
                          className={styles.item}
                          value={index.toString()}
                        >
                          <Accordion.Header asChild>
                            <Accordion.Trigger
                              asChild
                              className={styles.trigger}
                            >
                              <Box
                                as="button"
                                alignItems="center"
                                backgroundColor={
                                  !isTransfer
                                    ? {
                                        hover: 'surface/fill/quarternary',
                                      }
                                    : {}
                                }
                                display="flex"
                                width="full"
                                style={{ height: '32px' }}
                              >
                                <Inset space="8px">
                                  <Columns alignVertical="center" gap="8px">
                                    <Column
                                      alignVertical="center"
                                      width="content"
                                    >
                                      <Box style={{ width: '100px' }}>
                                        {!isTransfer ? (
                                          <FormattedAbiFunctionName
                                            data={call.data!}
                                          />
                                        ) : (
                                          <Text
                                            color="text/tertiary"
                                            size="11px"
                                          >
                                            Transfer
                                          </Text>
                                        )}
                                      </Box>
                                    </Column>
                                    <Column
                                      alignVertical="center"
                                      width="content"
                                    >
                                      <Box style={{ width: '120px' }}>
                                        {call?.to && (
                                          <Text.Truncated size="11px">
                                            {call.to}
                                          </Text.Truncated>
                                        )}
                                      </Box>
                                    </Column>
                                    <Column
                                      alignHorizontal="right"
                                      alignVertical="center"
                                    >
                                      {typeof call?.value === 'bigint' && (
                                        <Text size="11px">
                                          {`${numberIntl8SigFigs.format(
                                            Number(formatEther(call.value)),
                                          )} ETH`}
                                        </Text>
                                      )}
                                    </Column>
                                    <Column
                                      alignVertical="center"
                                      width="content"
                                    >
                                      <Box
                                        display="flex"
                                        paddingLeft="4px"
                                        style={{ width: '16px' }}
                                      >
                                        {!isTransfer && (
                                          <SFSymbol
                                            className={styles.chevron}
                                            color="text/tertiary"
                                            size="9px"
                                            symbol="chevron.down"
                                            weight="medium"
                                          />
                                        )}
                                      </Box>
                                    </Column>
                                  </Columns>
                                </Inset>
                              </Box>
                            </Accordion.Trigger>
                          </Accordion.Header>
                          {!isTransfer && (
                            <Accordion.Content asChild>
                              <Box className={styles.content}>
                                <Inset space="8px">
                                  <DecodedCalldata
                                    address={call.to}
                                    data={call.data || '0x'}
                                    showRawData={false}
                                  />
                                </Inset>
                              </Box>
                            </Accordion.Content>
                          )}
                        </Accordion.Item>
                      )
                    })}
                  </Accordion.Root>
                </Bleed>
              </TabsContent>
            </Inset>
          </Box>
        </Tabs.Root>
      </Stack>
    </PendingRequestContainer>
  )
}

////////////////////////////////////////////////////////////////////////
// Send Transaction View

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
    account: transactionRequest.from ?? account_,
  })

  const request = preparedRequest || {}
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

  ////////////////////////////////////////////////////////////////////////

  const { updatePendingRequest } = usePendingRequestsStore()

  const update: UpdateValuePopoverProps['onSubmit'] = (values) => {
    const { data, from, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value } =
      values

    const request = { ...args.request.params[0] }
    if (data) request.data = data
    if (from) request.from = from
    if (maxFeePerGas)
      request.maxFeePerGas = numberToHex(parseGwei(maxFeePerGas))
    if (maxPriorityFeePerGas)
      request.maxPriorityFeePerGas = numberToHex(
        parseGwei(maxPriorityFeePerGas),
      )
    if (typeof nonce === 'number') request.nonce = numberToHex(nonce)
    if (to) request.to = to
    if (value) request.value = numberToHex(parseEther(value))

    updatePendingRequest({
      ...args.request,
      params: [request],
    } as PendingRequest)
  }

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
              labelRight={
                <UpdateValuePopover
                  defaultValue={from}
                  name="from"
                  onSubmit={update}
                  validate={{
                    pattern: {
                      message: 'Address is not valid',
                      value: /^0x[a-fA-F0-9]+$/,
                    },
                    required: 'Address is required',
                  }}
                >
                  <Form.InputField
                    label="From"
                    height="24px"
                    hideLabel
                    placeholder="0xd2135CfB216b74109775236E36d4b433F1DF507B"
                    style={{ width: '300px' }}
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={to ?? ''}
                  name="to"
                  onSubmit={update}
                  validate={{
                    pattern: {
                      message: 'Address is not valid',
                      value: /^0x[a-fA-F0-9]+$/,
                    },
                    required: 'Address is required',
                  }}
                >
                  <Form.InputField
                    label="To"
                    height="24px"
                    hideLabel
                    placeholder="0xd2135CfB216b74109775236E36d4b433F1DF507B"
                    style={{ width: '360px' }}
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={
                    typeof value === 'bigint'
                      ? numberIntl8SigFigs.format(Number(formatEther(value)))
                      : ''
                  }
                  name="value"
                  onSubmit={update}
                  validate={{
                    min: 0,
                  }}
                >
                  <Form.InputField
                    label="Value"
                    height="24px"
                    hideLabel
                    placeholder="2"
                    type="number"
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={typeof gas === 'bigint' ? gas.toString() : ''}
                  name="gas"
                  onSubmit={update}
                  validate={{
                    min: 0,
                  }}
                >
                  <Form.InputField
                    label="Gas Limit"
                    height="24px"
                    hideLabel
                    placeholder="10"
                    type="number"
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={
                    typeof maxPriorityFeePerGas === 'bigint'
                      ? numberIntl8SigFigs.format(
                          Number(formatGwei(maxPriorityFeePerGas)),
                        )
                      : ''
                  }
                  name="maxPriorityFeePerGas"
                  onSubmit={update}
                  validate={{
                    min: 0,
                  }}
                >
                  <Form.InputField
                    label="Tip Per Gas"
                    height="24px"
                    hideLabel
                    placeholder="1"
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={
                    typeof maxFeePerGas === 'bigint'
                      ? numberIntl8SigFigs.format(
                          Number(formatGwei(maxFeePerGas)),
                        )
                      : ''
                  }
                  name="maxFeePerGas"
                  onSubmit={update}
                  validate={{
                    min: 0,
                  }}
                >
                  <Form.InputField
                    label="Max Fee Per Gas"
                    height="24px"
                    hideLabel
                    placeholder="5"
                  />
                </UpdateValuePopover>
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
              labelRight={
                <UpdateValuePopover
                  defaultValue={nonce}
                  name="nonce"
                  onSubmit={update}
                  validate={{
                    min: 0,
                  }}
                >
                  <Form.InputField
                    label="Nonce"
                    height="24px"
                    hideLabel
                    placeholder="151"
                    type="number"
                  />
                </UpdateValuePopover>
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
                    data={data || '0x'}
                    labelRight={
                      <UpdateValuePopover
                        defaultValue={data || '0x'}
                        name="data"
                        onSubmit={update}
                        validate={{
                          pattern: /^0x[a-fA-F0-9]*$/,
                        }}
                      >
                        <Form.InputField
                          label="Raw Data"
                          height="24px"
                          hideLabel
                          placeholder="0xdeadbeef"
                          style={{ width: '360px' }}
                        />
                      </UpdateValuePopover>
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

////////////////////////////////////////////////////////////////////////
// Request Accounts View

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

////////////////////////////////////////////////////////////////////////
// Sign Message View

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

////////////////////////////////////////////////////////////////////////
// Sign Typed Data View

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

///////////////////////////////////////////////////////////////

type UpdateValuePopoverProps = {
  children: ReactElement
  defaultValue?: string | number
  name: string
  onSubmit: (values: FieldValues) => void
  validate?: RegisterOptions
}

function UpdateValuePopover({
  children,
  defaultValue,
  name,
  onSubmit,
  validate,
}: UpdateValuePopoverProps) {
  const { formState, handleSubmit, register } = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
    mode: 'onChange',
  })

  return (
    <FormPopover
      disabled={!formState.isValid}
      onSubmit={handleSubmit(onSubmit)}
    >
      {cloneElement(children, {
        name,
        errorMessage: formState.errors[name]?.message,
        register: register(name, validate),
      })}
    </FormPopover>
  )
}
