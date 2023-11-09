import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import InventoryManager from '../inventory/InventoryManager'

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, item: PlayerItem) => {
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
        const invItem = InventoryManager.getInstance().getItemFromItem(item)
        const spawnPromises = []

        if (invItem?.projectileOptions) {
          for (
            let spawns = 0;
            spawns < invItem.projectileOptions.projectiles;
            spawns++
          ) {
            const spawn = game.spawn({
              entity: '@dreamlab/Projectile',
              args: {
                width: 50,
                height: 10,
                direction: player.facingDirection,
              },
              transform: {
                position: {
                  x: player.body.position.x + xOffset,
                  y: player.body.position.y - yOffset,
                },
                rotation: 0,
              },
              tags: ['net/replicated'],
            })
            spawnPromises.push(spawn)
          }

          await Promise.all(spawnPromises)
        } else {
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
      }
    },
  )
}
