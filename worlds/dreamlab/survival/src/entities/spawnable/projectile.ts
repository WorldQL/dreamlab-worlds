import {
  updateBodyWidthHeight
  
  
  
  
} from '@dreamlab.gg/core'
import type {
  PreviousArgs,RenderTime, SpawnableContext, SpawnableEntity, Time} from '@dreamlab.gg/core';
import { NonSolid, NonSolidArgs } from '@dreamlab.gg/core/dist/entities'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import { Vec } from '@dreamlab.gg/core/dist/math'
import { z } from '@dreamlab.gg/core/dist/sdk'
import { camera, debug, events, game, physics } from '@dreamlab.gg/core/labs'
import Matter from 'matter-js'

type Args = typeof ArgsSchema
const ArgsSchema = NonSolidArgs.extend({
  direction: z.number(),
  damage: z.number().default(1),
})

type OnCollisionStart = EventHandler<'onCollisionStart'>
type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>

export { ArgsSchema as ProjectileArgs }
export class Projectile<A extends Args = Args> extends NonSolid<A> {
  protected onCollisionStart: OnCollisionStart | undefined
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined

  protected readonly body: Matter.Body
  protected readonly rotation: number

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)

    // very weird bug - this.transform.rotation is 0 in onPhysicsTick but is the correct rotation here...
    this.rotation = this.transform.rotation
    this.body = Matter.Bodies.rectangle(
      this.transform.position.x,
      this.transform.position.y,
      this.args.width,
      this.args.height,
      {
        label: 'projectile',
        render: { visible: false },
        density: 0.001,
        frictionAir: 0,
        friction: 1,
        restitution: 0,
      },
    )

    const $game = game()

    events('client')?.addListener(
      'onPlayerCollisionStart',
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (other.id === this.body.id) {
          $game.destroy(this as SpawnableEntity)
        }
      }),
    )

    events('common')?.addListener(
      'onCollisionStart',
      (this.onCollisionStart = ([a, b], raw) => {
        if (a.uid === this.uid || b.uid === this.uid) {
          const other = a.uid === this.uid ? b : a

          const bodies = [raw.bodyA, raw.bodyB]

          const isSensor = bodies.some(body => body.isSensor)
          const isProjectile = other.definition.entity.includes('Projectile')

          if (!isSensor && !isProjectile) {
            $game.destroy(this as SpawnableEntity)
          }
        }
      }),
    )

    physics().register(this, this.body)
    physics().linkTransform(this.body, this.transform)
  }

  public override teardown(): void {
    super.teardown()

    physics().unregister(this, this.body)
    physics().unlinkTransform(this.body, this.transform)

    events('client')?.removeListener(
      'onPlayerCollisionStart',
      this.onPlayerCollisionStart,
    )

    events('common')?.removeListener('onCollisionStart', this.onCollisionStart)
  }

  public override onArgsUpdate(
    path: string,
    previousArgs: PreviousArgs<typeof ArgsSchema>,
  ): void {
    super.onArgsUpdate(path, previousArgs)
    updateBodyWidthHeight(path, this.body, this.args, previousArgs)
  }

  public override onPhysicsStep(_: Time): void {
    Matter.Body.setAngle(this.body, this.rotation)
    const speed = 50
    const velocity = {
      x: speed * Math.cos(this.rotation) * this.args.direction,
      y: speed * Math.sin(this.rotation),
    }
    Matter.Body.setVelocity(this.body, velocity)
  }

  public override onRenderFrame(_time: RenderTime) {
    const pos = Vec.add(this.body.position, camera().offset)

    this.container!.rotation = this.body.angle
    this.container!.position = pos

    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0
  }
}
