import type { InitClient } from '@dreamlab.gg/core/dist/sdk'
import { sharedInit } from './shared.ts'
import { initUI } from './ui.tsx'

export const init: InitClient = async game => {
  await initUI(game)
  await sharedInit(game)

  // ...
}
