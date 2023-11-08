import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, _item: PlayerItem) => {
      if (
        player.currentAnimation === 'bow' ||
        player.currentAnimation === 'gun'
      ) {
        const currentTime = Date.now()
        // need this code because the event gets emitted multiple times on a single animation frame :(
        if (!lastSpawnedTime || currentTime - lastSpawnedTime > 250) {
          lastSpawnedTime = currentTime
        } else {
          return
        }

        const xOffset = player.facingDirection === 1 ? 165 : -165
        const yOffset = 75

        await game.spawn({
          entity: '@dreamlab/Projectile',
          args: { width: 50, height: 10, direction: player.facingDirection },
          transform: {
            position: {
              x: player.body.position.x + xOffset,
              y: player.body.position.y - yOffset,
            },
            rotation: 0,
          },
          tags: ['net/replicated'],
        })
      }
    },
  )
}
