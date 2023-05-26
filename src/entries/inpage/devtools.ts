import { createMessenger } from '~/messengers'

const backgroundMessenger = createMessenger({ connection: 'background <> inpage' })

export async function injectDevtools() {
  const extensionId: string = await backgroundMessenger.send('extensionId', undefined)

  // Inject Devtools elements
  const container = injectContainer()
  injectIframe({ container, extensionId })
  const handle = injectHandle({ container })
  const openButton = injectOpenButton({ container })
  // TODO: put close button inside devtools context
  const closeButton = injectCloseButton({ container })

  // Setup listeners
  setupHandleListeners({ container, handle })
  setupToggleListeners({ container, closeButton, handle, openButton })
}

/////////////////////////////////////////////////////////////////////

function injectContainer() {
  const container = document.createElement('div')
  container.id = '__dev-wallet'
  container.style.width = '0px'
  container.style.height = '100vh'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.right = '0'
  container.style.border = 'none'
  container.style.zIndex = '2147483646'
  document.body.appendChild(container)
  return container
}

function injectIframe({
  container,
  extensionId,
}: { container: HTMLElement; extensionId: string }) {
  const iframe = document.createElement('iframe')
  iframe.src = `chrome-extension://${extensionId}/src/index.html`
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
  handle.style.width = '24px'
  handle.style.height = '100%'
  handle.style.position = 'absolute'
  handle.style.top = '0'
  handle.style.right = `${parseInt(container.style.width) - 16}px`
  handle.style.cursor = 'ew-resize'
  container.appendChild(handle)
  return handle
}

function injectOpenButton({ container }: { container: HTMLElement }) {
  const toggle = document.createElement('div')
  toggle.style.background = 'blue'
  toggle.style.position = 'absolute'
  toggle.style.top = '16px'
  toggle.style.right = '16px'
  toggle.style.borderRadius = '100%'
  toggle.style.width = '28px'
  toggle.style.height = '28px'
  toggle.style.cursor = 'pointer'
  toggle.style.display = 'flex'
  toggle.style.alignItems = 'center'
  toggle.style.justifyContent = 'center'
  container.appendChild(toggle)

  const walletIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  )
  walletIcon.setAttribute('viewBox', '0 0 94 91')
  walletIcon.setAttribute('width', '16')
  walletIcon.setAttribute('height', '16')
  walletIcon.style.position = 'absolute'
  toggle.appendChild(walletIcon)

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    'M11.7502 8.03125C7.74503 8.02475 3.84276 9.3251 0.541226 11.7448C0.768001 8.85732 1.92252 6.1417 3.80979 4.08629C5.92352 1.78424 8.78075 0.5 11.75 0.5H82.25C83.7212 0.5 85.1791 0.815517 86.5409 1.42987C87.9029 2.04429 89.1434 2.94617 90.1902 4.08629C91.2371 5.22648 92.0696 6.58236 92.6383 8.07747C93.0835 9.24825 93.3599 10.4856 93.4588 11.7455C90.2592 9.4021 86.4027 8.03125 82.25 8.03125L11.7508 8.03125C11.7506 8.03125 11.7504 8.03125 11.7502 8.03125ZM82.25 25.0938H11.7508C7.74541 25.0871 3.84292 26.3875 0.541226 28.8073C0.768001 25.9198 1.92252 23.2042 3.80979 21.1488C5.92352 18.8467 8.78075 17.5625 11.75 17.5625H82.25C83.7212 17.5625 85.1791 17.878 86.5409 18.4924C87.9029 19.1068 89.1434 20.0087 90.1902 21.1488C91.2371 22.289 92.0696 23.6449 92.6383 25.14C93.0835 26.3108 93.3599 27.5481 93.4588 28.808C90.2592 26.4646 86.4027 25.0938 82.25 25.0938ZM31.3333 34.625C32.5713 34.625 33.7682 35.1602 34.6577 36.129C35.5485 37.0992 36.0556 38.4236 36.0556 39.8125C36.0556 42.9488 37.1991 45.9644 39.2464 48.194C41.2949 50.4251 44.0829 51.6875 47 51.6875C49.9171 51.6875 52.7051 50.4251 54.7536 48.194C56.8009 45.9644 57.9444 42.9488 57.9444 39.8125C57.9444 38.4236 58.4515 37.0992 59.3423 36.129C60.2318 35.1602 61.4287 34.625 62.6667 34.625H82.25C83.7212 34.625 85.1791 34.9405 86.5409 35.5549C87.9029 36.1693 89.1434 37.0712 90.1902 38.2113C91.2371 39.3515 92.0696 40.7074 92.6383 42.2025C93.2069 43.6976 93.5 45.3014 93.5 46.9219V78.2031C93.5 79.8236 93.2069 81.4274 92.6383 82.9225C92.0696 84.4176 91.2371 85.7735 90.1902 86.9137C89.1434 88.0538 87.9029 88.9557 86.5409 89.5701C85.1791 90.1845 83.7212 90.5 82.25 90.5H11.75C8.78075 90.5 5.92352 89.2158 3.80979 86.9137C1.69475 84.6102 0.5 81.4776 0.5 78.2031V46.9219C0.5 43.6474 1.69475 40.5148 3.80979 38.2113C5.92352 35.9092 8.78075 34.625 11.75 34.625H31.3333Z',
  )
  path.setAttribute('stroke', 'white')
  path.setAttribute('stroke-width', '4')
  path.setAttribute('fill', 'none')
  walletIcon.appendChild(path)

  return toggle
}

function injectCloseButton({ container }: { container: HTMLElement }) {
  const toggle = document.createElement('div')
  toggle.innerText = '✕'
  toggle.style.display = 'none'
  toggle.style.position = 'absolute'
  toggle.style.top = '4px'
  toggle.style.right = '4px'
  toggle.style.width = '28px'
  toggle.style.height = '28px'
  toggle.style.cursor = 'pointer'
  toggle.style.alignItems = 'center'
  toggle.style.justifyContent = 'center'

  container.appendChild(toggle)
  return toggle
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
    container.style.width = `${width}px`
    handle.style.right = `${width - 16}px`
  })

  document.addEventListener('mouseup', () => {
    container.style.pointerEvents = 'inherit'
    isDragging = false
  })
}

function setupToggleListeners({
  container,
  closeButton,
  handle,
  openButton,
}: {
  container: HTMLElement
  closeButton: HTMLElement
  handle: HTMLElement
  openButton: HTMLElement
}) {
  async function listener({ open }: { open: boolean }) {
    if (!open) {
      openButton.style.display = 'flex'
      closeButton.style.display = 'none'
      container.style.width = '0px'
      handle.style.display = 'none'
    } else {
      closeButton.style.display = 'flex'
      openButton.style.display = 'none'
      container.style.width = '360px'
      handle.style.display = 'block'
      handle.style.right = '344px'
    }
  }

  openButton.addEventListener('click', () => {
    listener({ open: true })
  })

  closeButton.addEventListener('click', () => {
    listener({ open: false })
  })

  backgroundMessenger.reply('toggle-devtools', listener)
}
