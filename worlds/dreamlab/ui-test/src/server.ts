import type { InitServer } from '@dreamlab.gg/core/dist/sdk'
import { sharedInit } from './shared.ts'

export const init: InitServer = async game => {
  await sharedInit(game)

  // ...
}
