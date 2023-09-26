import { getMessenger } from '~/messengers'
import { windowStorage } from '~/storage'

const backgroundMessenger = getMessenger('background:contentScript')
const walletMessenger = getMessenger('wallet:contentScript')

backgroundMessenger.send('ping', undefined)
setInterval(() => {
  backgroundMessenger.send('ping', undefined)
}, 5000)

export async function injectWallet() {
  const extensionId: string = await backgroundMessenger.send(
    'extensionId',
    undefined,
  )

  if (process.env.NODE_ENV === 'development')
    windowStorage.local.setItem('open', true)

  // Inject wallet elements
  const container = await injectContainer()
  injectIframe({ container, extensionId })

  const handle = injectHandle({ container })
  setupHandleListeners({ container, handle })
  setupToggleListeners({ container, handle })
}

/////////////////////////////////////////////////////////////////////

async function injectContainer() {
  const container = document.createElement('div')
  container.id = '__dev-wallet'
  container.style.width = '0px'
  container.style.height = '100vh'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.right = '0'
  container.style.border = 'none'
  container.style.zIndex = '2147483646'

  if (document.body === null)
    await new Promise<void>((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve()
      })
    })

  document.body.appendChild(container)
  return container
}

function injectIframe({
  container,
  extensionId,
}: { container: HTMLElement; extensionId: string }) {
  const iframe = document.createElement('iframe')
  iframe.src = `chrome-extension://${extensionId}/src/index.html`
  iframe.allow = 'clipboard-write'
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.style.margin = '0px'
  iframe.style.padding = '0px'
  container.appendChild(iframe)
  return iframe
}

function injectHandle({ container }: { container: HTMLElement }) {
  const handle = document.createElement('div')
  handle.style.display = 'none'
  handle.style.width = '16px'
  handle.style.height = '100%'
  handle.style.position = 'absolute'
  handle.style.top = '80px'
  handle.style.right = `${parseInt(container.style.width) - 8}px`
  handle.style.cursor = 'ew-resize'
  container.appendChild(handle)
  return handle
}

function setupHandleListeners({
  container,
  handle,
}: { container: HTMLElement; handle: HTMLElement }) {
  let isDragging = false
  let startX = 0
  let startWidth = 0

  handle.addEventListener('mousedown', (e) => {
    container.style.pointerEvents = 'none'
    isDragging = true
    startX = e.pageX
    startWidth = parseInt(
      document.defaultView?.getComputedStyle(container).width ?? '0',
      10,
    )
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const width = startWidth + startX - e.pageX
    if (width < 400) return
    container.style.width = `${width}px`
    handle.style.right = `${width - 8}px`
  })

  document.addEventListener('mouseup', () => {
    container.style.pointerEvents = 'all'
    isDragging = false
  })
}

function setupToggleListeners({
  container,
  handle,
}: {
  container: HTMLElement
  handle: HTMLElement
}) {
  let open = Boolean(windowStorage.local.getItem('open')) || false

  async function listener(
    args: { route?: string; open?: boolean; useStorage?: boolean } | void = {},
  ) {
    if (args?.route) walletMessenger.send('pushRoute', args.route)

    if (args?.useStorage && windowStorage.local.getItem('open'))
      open = Boolean(windowStorage.local.getItem('open'))
    else open = args?.open ?? !open

    if (!open) {
      container.style.width = '0px'
      handle.style.display = 'none'
    } else {
      container.style.width = '400px'
      handle.style.display = 'block'
      handle.style.right = '392px'
    }

    if (typeof args?.open === 'undefined')
      windowStorage.local.setItem('open', open)
  }

  backgroundMessenger.reply('toggleWallet', listener)
  listener({ open })
}
