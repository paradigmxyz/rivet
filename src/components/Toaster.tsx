import { Toaster as Toaster_ } from 'sonner'

import './Toaster.css'

export function Toaster() {
  return (
    <Toaster_ closeButton expand={false} richColors position="top-center" />
  )
}
