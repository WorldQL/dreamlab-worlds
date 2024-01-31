import type { InitClient } from '@dreamlab.gg/core/sdk'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import type { FC } from 'https://esm.sh/react@18.2.0'

const App: FC = () => <p>hello!</p>

export const initUI: InitClient = async game => {
  const ui = document.createElement('div')
  game.client.ui.add(ui)

  const root = createRoot(ui)
  root.render(<App />)
}
