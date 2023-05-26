import { setupContextMenu } from './context-menu'
import { setupExtensionId } from './extension-id'
import { setupInpage } from './inpage'
import { setupRpcHandler } from './rpc'
import { syncStores } from '~/zustand'

setupContextMenu()
setupExtensionId()
setupInpage()
setupRpcHandler()
syncStores()
