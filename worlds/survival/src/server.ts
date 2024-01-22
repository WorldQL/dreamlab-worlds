import type { InitServer } from '@dreamlab.gg/core/sdk'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)
}
