import { deferUntilPlayer } from '@dreamlab.gg/core/dist/utils'
import type { InitClient } from '@dreamlab.gg/core/sdk'
import { preloadAssets } from './assetLoader.js'
import { sharedInit } from './shared.js'
import { initializeUI } from './ui/startScreen.js'

export const init: InitClient = async game => {
  await preloadAssets()
  initializeUI(game)
  deferUntilPlayer(async player => {
    const spawnpoints = game.queryTags('any', ['spawnpoint'])
    if (spawnpoints.length > 0) {
      const spawn = spawnpoints[Math.floor(Math.random() * spawnpoints.length)]
      if (spawn) player.teleport(spawn.transform.position, true)
    }

    player.characterId = 'c_y9ydqx2pghxl04emgnxu6r5g'
  })

  await sharedInit(game)
}
