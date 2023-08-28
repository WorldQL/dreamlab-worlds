import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  await sharedInit(game)

  // register custom packet handlers, etc
}
