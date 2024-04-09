import { loaders } from '@shazow/whatsabi'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, Hex } from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

type LookupSignatureParameters = {
  enabled?: boolean
  selector?: Hex
}

export const lookupSignatureQueryKey = createQueryKey<
  'lookup-signature',
  [key: Client['key'], selector: Hex]
>('lookup-signature')

export function useLookupSignatureQueryOptions({
  enabled,
  selector,
}: LookupSignatureParameters) {
  const client = useClient()
  return queryOptions({
    enabled: enabled && Boolean(selector),
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
    queryKey: lookupSignatureQueryKey([client.key, selector!]),
    async queryFn() {
      if (!selector) throw new Error('selector is required')
      if (!client) throw new Error('client is required')
      const signature =
        selector.length === 10
          ? await loaders.defaultSignatureLookup.loadFunctions(selector)
          : await loaders.defaultSignatureLookup.loadEvents(selector)
      return signature[0] ?? null
    },
  })
}

export function useLookupSignature(args: LookupSignatureParameters) {
  const queryOptions = useLookupSignatureQueryOptions(args)
  return useQuery(queryOptions)
}
