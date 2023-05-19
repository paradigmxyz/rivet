import { rpc } from 'viem/utils'

import { createRpcMessenger } from '~/messengers'

const rpcMessenger = createRpcMessenger({ connection: 'background <> inpage' })

export function setupRpcHandler() {
  rpcMessenger.reply('request', async (payload) => {
    return rpc.http('https://cloudflare-eth.com', { body: payload })
  })
}
