import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics, Sprite } from 'pixi.js'

interface ProjectileEntity {
  tags: string[]
  transform: {
    position: Matter.Vector
    rotation: number
  }
  isInBounds(position: Matter.Vector): boolean
  init(data: { game: any }): { game: any; body: Matter.Body }
  initRenderContext(
    _: unknown,
    data: { camera: any; stage: any },
  ): {
    camera: any
    container: Container
    gfxBounds: Graphics
    sprite?: Sprite
  }
  teardown(data: any): void
  teardownRenderContext(data: { container: Container }): void
  onPhysicsStep(data: { delta: number }, context: { game: any }): void
  onRenderFrame(
    _: unknown,
    context: { game: any },
    renderContext: { camera: any; container: Container; gfxBounds: Graphics },
  ): void
}

export const createProjectile = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    radius: number,
    direction: number,
    spriteSource?: string,
  ): ProjectileEntity => {
    const { position } = transform

    const body = Matter.Bodies.circle(position.x, position.y, radius, {
      isStatic: false,
      label: 'projectile',
      render: { visible: false },
      density: 0.001,
      frictionAir: 0,
      friction: 1,
      restitution: 0,
    })

    // const lifespan = 30000 // 30secs
    // let lifeTimer = 0
    const speed = 2
    const velocity = { x: direction * speed, y: 0 }
    let lastProjectileSpawnTime = 0
    const projectileSpawnCooldown = 2000

    return {
      tags,

      transform: cloneTransform(transform),

      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        const onPlayerAttack = (
          _playerBody: Matter.Body,
          animation: string,
        ) => {
          if (animation === 'bow') {
            const currentTime = Date.now()
            if (
              currentTime - lastProjectileSpawnTime >=
              projectileSpawnCooldown
            ) {
              lastProjectileSpawnTime = currentTime
              const playerDirection = _playerBody.velocity.x >= 0 ? 1 : -1
              game.spawn({
                entity: '@dreamlab/Projectile',
                args: [50, playerDirection],
                transform: {
                  position: [body.position.x, body.position.y],
                },
              })
            }
          }
        }

        game.physics.register(this, body)
        game.events.common.addListener('onPlayerAttack', onPlayerAttack)
        Matter.Body.setVelocity(body, velocity)
        return { game, body, onPlayerAttack }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxBounds = new Graphics()
        const sprite = spriteSource
          ? createSprite(spriteSource, {
              width: radius / 2,
              height: radius / 2,
              zIndex,
            })
          : undefined

        if (sprite) {
          container.addChild(sprite)
        } else {
          drawBox(
            gfxBounds,
            { width: radius / 2, height: radius / 2 },
            { stroke: '#00f' },
          )
          container.addChild(gfxBounds)
        }
        stage.addChild(container)

        return {
          camera,
          container,
          gfxBounds,
          sprite,
        }
      },

      teardown({ game, onPlayerAttack }) {
        game.physics.unregister(this, body)
        game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds }) {
        const debug = game.debug
        const pos = Vec.add(position, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
      },
    }
  },
)
