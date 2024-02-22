import type { SpawnableContext, SpawnableEntity, Time } from '@dreamlab.gg/core'
import { Solid, SolidArgs } from '@dreamlab.gg/core/dist/entities'
import { z } from '@dreamlab.gg/core/dist/sdk'
import { events, game } from '@dreamlab.gg/core/labs'
import Matter from 'matter-js'

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  direction: z.number(),
  damage: z.number().default(1),
})

export { ArgsSchema as ProjectileArgs }
export class Projectile<A extends Args = Args> extends Solid<A> {
  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.density = 0.001
    this.body.frictionAir = 0
    this.body.friction = 1
    this.body.restitution = 0

    this.body.label = 'projectile'

    // might have to use client
    const $game = game()

    events('client')?.on('onPlayerCollisionStart', ([_player, other]) => {
      if (other.id === this.body.id) {
        $game.destroy(this as SpawnableEntity)
      }
    })

    events('common')?.on('onCollisionStart', ([a, b], raw) => {
      if (a.uid === this.uid || b.uid === this.uid) {
        const other = a.uid === this.uid ? b : a

        const bodies = [raw.bodyA, raw.bodyB]

        const isSensor = bodies.some(body => body.isSensor)
        const isProjectile = other.definition.entity.includes('Projectile')

        if (!isSensor && !isProjectile) {
          $game.destroy(this as SpawnableEntity)
        }
      }
    })
  }

  public override onPhysicsStep(_: Time): void {
    const $game = game('client')
    if (!$game) {
      return
    }

    Matter.Body.setAngle(this.body, 0)
    Matter.Body.setAngularVelocity(this.body, 0)

    const speed = 50
    const velocity = {
      x: speed * Math.cos(this.transform.rotation) * this.args.direction,
      y: speed * Math.sin(this.transform.rotation),
    }
    Matter.Body.setVelocity(this.body, velocity)
  }
}
