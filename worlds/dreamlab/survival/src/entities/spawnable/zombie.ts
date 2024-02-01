import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity, isEntity } from '@dreamlab.gg/core'
import { z } from '@dreamlab.gg/core/dist/sdk'
import { SpriteSourceSchema } from '@dreamlab.gg/core/dist/textures'
import type { Camera } from '@dreamlab.gg/core/entities'
import { isNetPlayer } from '@dreamlab.gg/core/entities'
import type { EventHandler } from '@dreamlab.gg/core/events'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import {
  onlyNetClient,
  onlyNetServer,
  syncedValue,
} from '@dreamlab.gg/core/network'
import type {
  MessageListenerServer,
  NetClient,
  NetServer,
  SyncedValue,
} from '@dreamlab.gg/core/network'
import {
  deferUntilPhysicsStep,
  drawBox,
  drawCircle,
} from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import type { Resource, Texture } from 'pixi.js'
import { AnimatedSprite, Container, Graphics } from 'pixi.js'
import { getPreloadedAssets } from '../../assetLoader'
import { events } from '../../events'
import InventoryManager from '../../inventory/inventoryManager'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(200),
  height: z.number().positive().min(1).default(200),
  maxHealth: z.number().positive().min(1).default(10),
  speed: z.number().positive().min(1).default(1),
  knockback: z.number().positive().min(0).default(2),
  spriteSource: SpriteSourceSchema.optional(),
})

type OnPlayerAttack = EventHandler<'onPlayerAttack'>
type OnCollisionStart = EventHandler<'onCollisionStart'>
type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>
type zombieAnimations = 'punch' | 'recoil' | 'walk'

interface MobData {
  health: number
  direction: number
  hitCooldown: number
  patrolDistance: number
  currentAnimation: zombieAnimations
  directionCooldown: number
}

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  onPlayerAttack: OnPlayerAttack
  onCollisionStart: OnCollisionStart
  onPlayerCollisionStart: OnPlayerCollisionStart

  mobData: SyncedValue<MobData>
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  gfxHittest: Graphics
  ctrHealth: Container
  gfxHealthAmount: Graphics
  sprite: AnimatedSprite
}

const zombieSymbol = Symbol.for('@cvz/core/entities/zombie')
export const isZombie = (
  entity: unknown,
): entity is SpawnableEntity<Data, Render> => {
  if (!isEntity(entity)) return false
  return zombieSymbol in entity && entity[zombieSymbol] === true
}

export const createZombieMob = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ uid, tags, transform }, args) => {
  const HIT_CHANNEL = '@cvz/Hittable/hit'
  const { position, zIndex } = transform

  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    args.width,
    args.height,
    {
      label: 'zombie',
      inertia: Number.POSITIVE_INFINITY,
    },
  )

  const patrolDistance = 300
  const hitRadius = args.width / 2 + 120
  const hitCooldown = 0.5 // Second(s)
  const healthIndicatorWidth = args.width + 50
  const healthIndicatorHeight = 20

  const zombieAnimations: Record<string, Texture<Resource>[]> = {}

  return {
    [zombieSymbol]: true,

    get tags() {
      return tags
    },

    get transform() {
      return cloneTransform(transform)
    },

    rectangleBounds() {
      return { width: args.width, height: args.height }
    },

    isPointInside(position) {
      return Matter.Query.point([body], position).length > 0
    },

    init({ game, physics }) {
      game.physics.register(this, body)
      physics.linkTransform(body, transform)

      if (!tags.includes('net/replicated')) {
        tags.push(
          'net/replicated',
          'net/server-authoritative',
          'editor/doNotSave',
        )
      }

      const netServer = onlyNetServer(game)
      const netClient = onlyNetClient(game)

      const mobData = syncedValue(game, uid, 'mobData', {
        health: args.maxHealth,
        direction: 1,
        hitCooldown: 0,
        patrolDistance: 0,
        currentAnimation: 'walk' as zombieAnimations,
        directionCooldown: 0,
      })

      const onPlayerAttack: OnPlayerAttack = (player, item) => {
        if (
          mobData.value.hitCooldown <= 0 &&
          item?.animationName !== 'bow' &&
          item?.animationName !== 'shoot'
        ) {
          const xDiff = player.body.position.x - body.position.x

          if (Math.abs(xDiff) <= hitRadius) {
            let damage = 1
            if (item) {
              const inventoryManager = InventoryManager.getInstance()
              const inventoryItem =
                inventoryManager.getInventoryItemFromBaseGear(item)

              if (inventoryItem) {
                damage = inventoryItem.damage
              }
            }

            void netClient?.sendCustomMessage(HIT_CHANNEL, { uid, damage })

            if (mobData.value.health - damage <= 0) {
              events.emit('onPlayerScore', args.maxHealth * 25)
            }
          }
        }
      }

      const onCollisionStart: OnCollisionStart = ([a, b]) => {
        if (a.uid === uid || b.uid === uid) {
          const other = a.uid === uid ? b : a

          if (other.definition.entity.includes('Projectile')) {
            const damage = other.args.damage ?? 1
            void netClient?.sendCustomMessage(HIT_CHANNEL, { uid, damage })

            if (mobData.value.health - damage <= 0) {
              events.emit('onPlayerScore', args.maxHealth * 25)
            }
          }
        }
      }

      const onPlayerCollisionStart: OnPlayerCollisionStart = (
        [player, bodyCollided],
        _raw,
      ) => {
        if (body && bodyCollided === body) {
          const heightDifference = player.body.position.y - body.position.y

          const mobHeight = body.bounds.max.y - body.bounds.min.y
          const threshold = mobHeight
          if (heightDifference < -threshold) {
            const damage = 2
            void netClient?.sendCustomMessage(HIT_CHANNEL, { uid, damage })
            const bounceForce = { x: 0, y: -4 }
            deferUntilPhysicsStep(game, () => {
              Matter.Body.applyForce(
                player.body,
                player.body.position,
                bounceForce,
              )
            })
          } else {
            events.emit('onPlayerDamage', 1)
            const force = 4 * -player.facingDirection
            deferUntilPhysicsStep(game, () => {
              Matter.Body.applyForce(player.body, player.body.position, {
                x: force,
                y: -1,
              })
            })
          }
        }
      }

      const onHitServer: MessageListenerServer = async (
        { peerID },
        _,
        data,
      ) => {
        const network = netServer
        if (!network) throw new Error('missing network')

        const { uid: dataUid, damage } = data
        if (dataUid !== uid || typeof damage !== 'number') return

        const player = game.entities.find(
          ev => isNetPlayer(ev) && ev.peerID === peerID,
        )
        if (!player) throw new Error('missing netplayer')

        mobData.value.hitCooldown = hitCooldown * 60
        Matter.Body.applyForce(body, body.position, {
          x: args.knockback * -mobData.value.direction,
          y: -1.75,
        })

        mobData.value.health -= damage
        await (mobData.value.health <= 0
          ? game.destroy(this as SpawnableEntity)
          : network.broadcastCustomMessage(HIT_CHANNEL, {
              uid,
              health: mobData.value.health,
            }))
      }

      netServer?.addCustomMessageListener(HIT_CHANNEL, onHitServer)

      game.events.common.addListener('onPlayerAttack', onPlayerAttack)
      game.events.common.addListener('onCollisionStart', onCollisionStart)
      game.events.client?.addListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )

      return {
        game,
        body,
        onHitServer,
        netServer,
        netClient,
        onPlayerAttack,
        onCollisionStart,
        onPlayerCollisionStart,
        mobData,
      }
    },

    initRenderContext: async (_, { camera, stage }) => {
      const assets = getPreloadedAssets()
      zombieAnimations.walk = assets.walkTextures
      zombieAnimations.recoil = assets.recoilTextures
      zombieAnimations.punch = assets.punchTextures
      const sprite = new AnimatedSprite(zombieAnimations.walk!)
      sprite.gotoAndPlay(0)
      sprite.anchor.set(0.45, 0.535)

      const originalWidth = sprite.texture.width
      const originalHeight = sprite.texture.height
      const scaleX = (args.width * 1.5) / originalWidth
      const scaleY = (args.height * 1.5) / originalHeight
      const uniformScale = Math.max(scaleX, scaleY)

      sprite.scale.set(uniformScale, uniformScale)

      const container = new Container()
      container.sortableChildren = true
      container.zIndex = zIndex

      const gfxBounds = new Graphics()
      const gfxHittest = new Graphics()

      const ctrHealth = new Container()
      ctrHealth.sortableChildren = true

      gfxHittest.zIndex = -1
      ctrHealth.zIndex = 1
      ctrHealth.position.y = -args.height / 2 - 30

      drawBox(
        gfxBounds,
        { width: args.width, height: args.height },
        { stroke: '#00f' },
      )
      drawCircle(
        gfxHittest,
        { radius: hitRadius },
        { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
      )

      const gfxHealthBorder = new Graphics()
      const gfxHealthAmount = new Graphics()

      drawBox(
        gfxHealthBorder,
        { width: healthIndicatorWidth, height: healthIndicatorHeight },
        {
          fill: 'white',
          stroke: 'black',
          fillAlpha: 1,
          strokeAlign: 1,
          strokeWidth: 4,
        },
      )

      ctrHealth.addChild(gfxHealthBorder)
      ctrHealth.addChild(gfxHealthAmount)

      container.addChild(gfxBounds)
      container.addChild(gfxHittest)
      container.addChild(ctrHealth)
      stage.addChild(container)
      stage.addChild(sprite)

      return {
        camera,
        container,
        gfxBounds,
        gfxHittest,
        ctrHealth,
        gfxHealthAmount,
        sprite,
      }
    },

    teardown({
      game,
      onHitServer,
      netServer,
      onPlayerAttack,
      onCollisionStart,
      onPlayerCollisionStart,
    }) {
      game.physics.unregister(this, body)
      game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
      game.events.common.removeListener('onCollisionStart', onCollisionStart)
      game.events.client?.removeListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )

      netServer?.removeCustomMessageListener(HIT_CHANNEL, onHitServer)
    },

    teardownRenderContext({ container, ctrHealth, sprite }) {
      container.destroy({ children: true })
      ctrHealth.destroy({ children: true })
      sprite.destroy()
    },

    onArgsUpdate(path, previous, data, render) {
      if (path === 'width' || path === 'height') {
        const { width: originalWidth, height: originalHeight } = previous
        const { width, height } = args

        const scaleX = width / originalWidth
        const scaleY = height / originalHeight

        Matter.Body.setAngle(data.body, 0)
        Matter.Body.scale(data.body, scaleX, scaleY)
        Matter.Body.setAngle(body, toRadians(transform.rotation))

        if (render) {
          drawBox(render.gfxBounds, { width, height })
          if (render.sprite) {
            render.sprite.width = width
            render.sprite.height = height
          }
        }
      }
    },

    onResize({ width, height }) {
      args.width = width
      args.height = height
    },

    async onPhysicsStep(_, { game, mobData }) {
      if (game.server) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        mobData.value.hitCooldown = Math.max(0, mobData.value.hitCooldown - 1)
        mobData.value.directionCooldown = Math.max(
          0,
          mobData.value.directionCooldown - 1,
        )

        let closestPlayer: Matter.Body | null = null
        let minDistance = Number.POSITIVE_INFINITY

        const searchArea = {
          min: { x: body.position.x - 5_000, y: body.position.y - 5_000 },
          max: { x: body.position.x + 5_000, y: body.position.y + 5_000 },
        }

        const bodiesInRegion = Matter.Query.region(
          Matter.Composite.allBodies(game.physics.engine.world),
          searchArea,
        )

        for (const player of bodiesInRegion) {
          if (player.label === 'player') {
            const dx = player.position.x - body.position.x
            const dy = player.position.y - body.position.y
            const distanceSquared = dx * dx + dy * dy

            if (distanceSquared < minDistance) {
              minDistance = distanceSquared
              closestPlayer = player
            }
          }
        }

        minDistance = Math.sqrt(minDistance)

        if (mobData.value.hitCooldown > 0) {
          mobData.value.currentAnimation = 'recoil'
        } else if (closestPlayer && minDistance < 150) {
          mobData.value.currentAnimation = 'punch'
        } else if (mobData.value.currentAnimation !== 'walk') {
          mobData.value.currentAnimation = 'walk'
        }

        if (closestPlayer && minDistance < 2_000) {
          const verticalDistance = Math.abs(
            closestPlayer.position.y - body.position.y,
          )
          const horizontalDistance = Math.abs(
            closestPlayer.position.x - body.position.x,
          )

          if (
            verticalDistance < horizontalDistance &&
            mobData.value.directionCooldown === 0
          ) {
            mobData.value.direction =
              closestPlayer.position.x > body.position.x ? 1 : -1
            mobData.value.directionCooldown = 1
          }

          Matter.Body.translate(body, {
            x: args.speed * mobData.value.direction,
            y: 0,
          })
        } else {
          // patrol back and fourth when player is far from entity
          if (mobData.value.patrolDistance > patrolDistance) {
            mobData.value.patrolDistance = 0
            mobData.value.direction *= -1
          }

          Matter.Body.translate(body, {
            x: (args.speed / 2) * mobData.value.direction,
            y: 0,
          })

          mobData.value.patrolDistance += Math.abs(args.speed / 2)
        }

        if (!closestPlayer || minDistance > 5_000) {
          await game.destroy(this as SpawnableEntity)
        }
      }
    },

    onRenderFrame(
      { smooth },
      { game, mobData },
      { camera, container, gfxHittest, gfxBounds, gfxHealthAmount, sprite },
    ) {
      const debug = game.debug
      const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
      const pos = Vec.add(smoothed, camera.offset)

      sprite.scale.x = -mobData.value.direction

      sprite.position = pos
      if (
        sprite.textures !== zombieAnimations[mobData.value.currentAnimation]
      ) {
        sprite.textures = zombieAnimations[mobData.value.currentAnimation]!
        sprite.gotoAndPlay(0)
      }

      container.position = pos
      container.rotation = body.angle

      const alpha = debug.value ? 0.5 : 0
      gfxBounds.alpha = alpha
      gfxHittest.alpha = mobData.value.hitCooldown === 0 ? alpha / 3 : 0

      drawBox(
        gfxHealthAmount,
        {
          width: (mobData.value.health / args.maxHealth) * healthIndicatorWidth,
          height: 20,
        },
        { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
      )
    },
  }
})
