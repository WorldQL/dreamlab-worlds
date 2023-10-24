import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'

export const startGame = (game: Game<false>) => {
  game.events.custom.addListener('onPlayerKill', (...args: unknown[]) => {
    const player = args[0] as Player
    console.log('Kill counter:', player)
  })
}
