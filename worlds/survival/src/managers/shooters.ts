import type { Game } from '@dreamlab.gg/core'
import { isNetPlayer } from '@dreamlab.gg/core/dist/entities'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { Gear } from '@dreamlab.gg/core/dist/managers'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/dist/network'
import InventoryManager, {
  ProjectileTypes,
} from '../inventory/InventoryManager'

const delay = async (ms: number | undefined) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const ATTACK_COOLDOWN = 250
const SHOOT_CHANNEL = '@dreamlab/Projectile/fired'
const SHOT_DELAY = 100
const Y_OFFSET_DEFAULT = 75

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null
  const netClient = onlyNetClient(game)
  const netServer = onlyNetServer(game)

  const spawnProjectile = async (
    direction: number,
    animation: string,
    position: [number, number],
    angleOffset: number,
    yOffset = Y_OFFSET_DEFAULT,
  ) => {
    const xOffset = direction === 1 ? 165 : -165
    const additionalOffsetY = animation === 'shoot' ? -50 : 0
    return game.spawn({
      entity: '@dreamlab/Projectile',
      args: { width: 50, height: 10, direction },
      transform: {
        position: {
          x: position[0] + xOffset,
          y: position[1] - yOffset + additionalOffsetY,
        },
        rotation: angleOffset,
      },
      tags: ['net/replicated', 'net/server-authoritative', 'editor/doNotSave'],
    })
  }

  const onHitServer: MessageListenerServer = async ({ peerID }, _, data) => {
    if (!netServer) throw new Error('missing network')
    const player = game.entities
      .filter(isNetPlayer)
      .find(netplayer => netplayer.peerID === peerID)
    if (!player) throw new Error('missing netplayer')
    const { direction, animation, position, angle, yOffset } = data as {
      direction: number
      animation: string
      position: [number, number]
      angle: number
      yOffset?: number
    }
    await spawnProjectile(direction, animation, position, angle, yOffset)
  }

  netServer?.addCustomMessageListener(SHOOT_CHANNEL, onHitServer)

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, gear: Gear | undefined) => {
      if (
        player.currentAnimation === 'bow' ||
        player.currentAnimation === 'shoot'
      ) {
        if (!gear) return
        const currentTime = Date.now()
        if (!lastSpawnedTime || currentTime - lastSpawnedTime > ATTACK_COOLDOWN)
          lastSpawnedTime = currentTime
        else return

        const invItem =
          InventoryManager.getInstance().getInventoryItemFromBaseGear(gear)

        const sendProjectileMessage = (angle: number, yOffset?: number) =>
          void netClient?.sendCustomMessage(SHOOT_CHANNEL, {
            direction: player.facingDirection,
            animation: player.currentAnimation,
            position: [player.body.position.x, player.body.position.y],
            angle,
            yOffset,
          })

        switch (invItem?.projectileType) {
          case ProjectileTypes.SINGLE_SHOT:
          case ProjectileTypes.DOUBLE_SHOT:
          case ProjectileTypes.BURST_SHOT:
            for (
              let idx = 0;
              idx <
              (invItem.projectileType === ProjectileTypes.SINGLE_SHOT
                ? 1
                : invItem.projectileType === ProjectileTypes.DOUBLE_SHOT
                ? 2
                : 3);
              idx++
            ) {
              sendProjectileMessage(0)
              // eslint-disable-next-line no-await-in-loop
              if (idx < 2) await delay(SHOT_DELAY)
            }

            break
          case ProjectileTypes.SCATTER_SHOT:
          case ProjectileTypes.DOUBLE_SCATTER_SHOT: {
            const scatterShots =
              invItem.projectileType === ProjectileTypes.SCATTER_SHOT ? 1 : 2
            for (let idx = 0; idx < scatterShots; idx++) {
              sendProjectileMessage(0.1, 70)
              sendProjectileMessage(0)
              sendProjectileMessage(-0.1, 80)
              // eslint-disable-next-line no-await-in-loop
              if (idx < 1) await delay(SHOT_DELAY)
            }

            break
          }

          case undefined:
            throw new Error('Not implemented yet: undefined case')
          case ProjectileTypes.EXPLOSIVE_SHOT:
            throw new Error(
              'Not implemented yet: ProjectileTypes.EXPLOSIVE_SHOT case',
            )
        }
      }
    },
  )
}
