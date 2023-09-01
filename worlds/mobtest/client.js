import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  try {
    const data = window.localStorage.getItem('globalPassedPlayerData')
    if (data) console.log(JSON.parse(data))
  } catch {
    console.log('JSON parse error for globalPassedPlayerData')
  }

  await sharedInit(game)
}
