import type {
  RenderTime,
  SpawnableContext,
  SpawnableEntity,
  Time,
} from '@dreamlab.gg/core'
import { Solid, SolidArgs } from '@dreamlab.gg/core/dist/entities'
import { Vec } from '@dreamlab.gg/core/dist/math'
import { z } from '@dreamlab.gg/core/dist/sdk'
import { camera, debug, events, game } from '@dreamlab.gg/core/labs'
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
    this.body.isStatic = false

    this.body.label = 'projectile'

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
    Matter.Body.setAngle(this.body, this.transform.rotation)

    const speed = 50
    const velocity = {
      x: speed * Math.cos(this.transform.rotation) * this.args.direction,
      y: speed * Math.sin(this.transform.rotation),
    }
    Matter.Body.setVelocity(this.body, velocity)
  }

  public override onRenderFrame(time: RenderTime) {
    super.onRenderFrame(time)

    // const pos = Vec.add(this.body.position, camera().offset);

    // this.container!.rotation = this.body.angle;
    // this.container!.position = pos;

    // if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0;
  }
}
