import type { Game } from '@dreamlab.gg/core'

export const startGame = (game: Game<false>) => {
  console.log('started')
  game.events.custom.addListener('onPlayerKill', (...args: unknown[]) => {
    console.log('Kill counter:', args[0])
  })
}
