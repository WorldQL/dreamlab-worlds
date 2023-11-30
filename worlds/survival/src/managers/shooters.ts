import type { Game } from '@dreamlab.gg/core'
import { isNetPlayer } from '@dreamlab.gg/core/dist/entities'
import type { NetPlayer, Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/dist/network'
import type { Texture } from 'pixi.js'
import InventoryManager, {
  ProjectileTypes,
} from '../inventory/InventoryManager'

const delay = async (ms: number | undefined) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const Y_OFFSET_DEFAULT = 75
const ATTACK_COOLDOWN = 250
const SHOT_DELAY = 100
const SHOOT_CHANNEL = '@dreamlab/Projectile/fired'

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  const netClient = onlyNetClient(game)
  const netServer = onlyNetServer(game)

  const spawnProjectile = async (
    player: NetPlayer,
    angleOffset: number,
    yOffset = Y_OFFSET_DEFAULT,
  ) => {
    const xOffsetFactor = 165
    const xOffset =
      player.facingDirection === 1 ? xOffsetFactor : -xOffsetFactor

    let additionalOffsetX = 0
    let additionalOffsetY = 0

    if (player.currentAnimation === 'shoot') {
      additionalOffsetX = 0
      additionalOffsetY = -50
    }

    console.log('spawned?')

    return game.spawn({
      entity: '@dreamlab/Projectile',
      args: { width: 50, height: 10, direction: player.facingDirection },
      transform: {
        position: {
          x: player.body.position.x + xOffset,
          y: player.body.position.y - yOffset + additionalOffsetY,
        },
        rotation: angleOffset,
      },
      tags: ['net/replicated', 'net/server-authoritative', 'editor/doNotSave'],
    })
  }

  const onHitServer: MessageListenerServer = async ({ peerID }, _, data) => {
    const network = netServer
    if (!network) throw new Error('missing network')

    const player = game.entities
      .filter(isNetPlayer)
      .find(netplayer => netplayer.peerID === peerID)

    if (!player) throw new Error('missing netplayer')

    console.log('spawning!')
    // await spawnProjectile(player, data.angle as number)
    const xOffsetFactor = 165
    const xOffset =
      player.facingDirection === 1 ? xOffsetFactor : -xOffsetFactor

    let additionalOffsetX = 0
    let additionalOffsetY = 0

    if (player.currentAnimation === 'shoot') {
      additionalOffsetX = 0
      additionalOffsetY = -50
    }

    // const spawn = await game.spawn({
    //   entity: '@dreamlab/ZombieMob',
    //   args: { width: 80, height: 260, maxHealth: 4, speed: 2, knockback: 0.5 },
    //   transform: {
    //     position: {
    //       x: player.body.position.x + xOffset,
    //       y: player.body.position.y - Y_OFFSET_DEFAULT + additionalOffsetY,
    //     },
    //     rotation: data.angle as number,
    //   },
    //   tags: ['net/replicated', 'net/server-authoritative', 'editor/doNotSave'],
    // })

    const spawn = await game.spawn({
      entity: '@dreamlab/Projectile',
      args: { width: 50, height: 10, direction: player.facingDirection },
      transform: {
        position: {
          x: player.body.position.x + xOffset,
          y: player.body.position.y - Y_OFFSET_DEFAULT + additionalOffsetY,
        },
        rotation: data.angle as number,
      },
      tags: ['net/replicated', 'net/server-authoritative', 'editor/doNotSave'],
    })

    console.log(spawn)
  }

  netServer?.addCustomMessageListener(SHOOT_CHANNEL, onHitServer)

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, gear: PlayerItem) => {
      if (
        player.currentAnimation === 'bow' ||
        player.currentAnimation === 'shoot'
      ) {
        const currentTime = Date.now()
        if (
          !lastSpawnedTime ||
          currentTime - lastSpawnedTime > ATTACK_COOLDOWN
        ) {
          lastSpawnedTime = currentTime
        } else {
          return
        }

        const invItem = InventoryManager.getInstance().getItemFromItem(gear)

        switch (invItem?.projectileType) {
          case ProjectileTypes.SINGLE_SHOT:
            // Inside the 'onPlayerAttack' listener
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              angle: 0,
            })

            break
          case undefined: {
            throw new Error('Not implemented yet: undefined case')
          }

          case ProjectileTypes.BURST_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.BURST_SHOT case',
            )
          }

          case ProjectileTypes.DOUBLE_SCATTER_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.DOUBLE_SCATTER_SHOT case',
            )
          }

          case ProjectileTypes.DOUBLE_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.DOUBLE_SHOT case',
            )
          }

          case ProjectileTypes.EXPLOSIVE_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.EXPLOSIVE_SHOT case',
            )
          }

          case ProjectileTypes.SCATTER_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.SCATTER_SHOT case',
            )
          }

          // case ProjectileTypes.DOUBLE_SHOT:
          //   await spawnProjectile(player, gear, 0)
          //   await delay(SHOT_DELAY)
          //   await spawnProjectile(player, gear, 0)
          //   break

          // case ProjectileTypes.BURST_SHOT:
          //   await spawnProjectile(player, gear, 0)
          //   await delay(SHOT_DELAY)
          //   await spawnProjectile(player, gear, 0)
          //   await delay(SHOT_DELAY)
          //   await spawnProjectile(player, gear, 0)
          //   break

          // case ProjectileTypes.SCATTER_SHOT:
          //   await spawnProjectile(player, gear, 0.1, 70)
          //   await spawnProjectile(player, gear, 0)
          //   await spawnProjectile(player, gear, -0.1, 80)
          //   break

          // case ProjectileTypes.DOUBLE_SCATTER_SHOT:
          //   await spawnProjectile(player, gear, 0.1, 70)
          //   await spawnProjectile(player, gear, 0)
          //   await spawnProjectile(player, gear, -0.1, 80)
          //   await delay(SHOT_DELAY)

          //   await spawnProjectile(player, gear, 0.1, 70)
          //   await spawnProjectile(player, gear, 0)
          //   await spawnProjectile(player, gear, -0.1, 80)
          //   break

          // default:
          //   await spawnProjectile(player, gear, 0)
        }
      }
    },
  )
}
