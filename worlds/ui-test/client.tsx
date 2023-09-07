import React from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'

import type { InitClient } from '@dreamlab.gg/core/sdk'

const App = () => (
  <>
    <p>hello!</p>
  </>
)

export const init: InitClient = async game => {
  const uiContainer = document.createElement('div')
  game.client.ui.add(uiContainer)

  const reactRoot = createRoot(uiContainer)
  reactRoot.render(<App />)
}
