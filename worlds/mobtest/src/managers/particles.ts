import type { Game, SpawnableEntity } from '@dreamlab.gg/core'

export const renderParticles = (game: Game<false>) => {
  game.events.common.addListener(
    'onCollisionStart',
    async (pair: readonly [a: SpawnableEntity, b: SpawnableEntity]) => {
      const [a, b] = pair

      const bodiesA = game.physics.getBodies(a)
      const bodiesB = game.physics.getBodies(b)

      const isAParticle = bodiesA.some(body => body.label === 'particle')
      const isBParticle = bodiesB.some(body => body.label === 'particle')

      if (!isAParticle && !isBParticle) return

      const particle = isAParticle ? a : b

      await game.destroy(particle)
      console.log('destroy')

      const radius = 50

      if (!radius) {
        return
      }

      if (radius < 5) return

      const newRadius = radius / 2

      const body = game.physics.getBodies(particle)[0]
      if (!body) {
        return
      }

      const spawnPromises = []
      for (let index = 0; index < 2; index++) {
        spawnPromises.push(
          game.spawn({
            entity: '@dreamlab/Particle',
            args: {
              radius: newRadius,
            },
            transform: {
              position: {
                x: body.position.x,
                y: body.position.y,
              },
              rotation: 0,
            },
            tags: ['net/replicated'],
          }),
        )
      }

      await Promise.all(spawnPromises)
    },
  )
}
