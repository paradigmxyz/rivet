import { setupContextMenu } from './context-menu'
import { setupInpage } from './inpage'
import { setupRpcHandler } from './rpc'
import { syncStores } from '~/zustand'

setupContextMenu()
setupInpage()
setupRpcHandler()
syncStores()
