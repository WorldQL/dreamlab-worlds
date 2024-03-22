import type { RenderTime, SpawnableContext, Time } from "@dreamlab.gg/core"
import { Solid, SolidArgs } from "@dreamlab.gg/core/dist/entities"
import { camera, game } from "@dreamlab.gg/core/dist/labs"
import { z } from "@dreamlab.gg/core/dist/sdk"
import { distance, Vec } from "@dreamlab.gg/core/math"
import type { Vector } from "matter-js"
import Matter from "matter-js"

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  mustConnectWithBody: z.boolean()
})

export { ArgsSchema as GrappleHookArgs }
export class GrappleHook<A extends Args = Args> extends Solid<A> {
  private cursorPosition: Vector | undefined = undefined
  private hasReachedTarget = false

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)

    if (!this.tags.includes("editor/doNotSave")) {
      this.tags.push("editor/doNotSave")
    }

    this.body.collisionFilter = {
      category: 0x0004,
      mask: 0x0000
    }
    this.body.frictionAir = 0.2
    this.body.label = "grappleHook"

    if (!this.args.mustConnectWithBody) this.args.mustConnectWithBody = false

    const $game = game("client")
    if (!$game) return

    $game.client?.render.container.addEventListener("pointerover", ev => () => {
      const screenPosition = Vec.create(ev.offsetX, ev.offsetY)
      this.cursorPosition = camera().screenToWorld(screenPosition)
    })
    $game.client?.render.container.addEventListener("pointerout", () => {
      this.cursorPosition = undefined
    })
    $game.client?.render.container.addEventListener("pointermove", ev => () => {
      const screenPosition = Vec.create(ev.offsetX, ev.offsetY)
      this.cursorPosition = camera().screenToWorld(screenPosition)
    })
  }

  public override onPhysicsStep(_: Time): void {
    const $game = game("client")
    if (!$game) {
      return
    }

    Matter.Body.setAngle(this.body, 0)
    Matter.Body.setAngularVelocity(this.body, 0)

    const playerBody = Matter.Composite.allBodies($game.physics.engine.world).find(
      b => b.label === "player"
    )
    if (!playerBody) return

    const inputs = $game.client?.inputs
    const isCrouching = inputs?.getInput("@cvz/hook") ?? false

    if (isCrouching && this.cursorPosition) {
      if (this.args.mustConnectWithBody) {
        const bodiesAtCursor = Matter.Query.point(
          Matter.Composite.allBodies($game.physics.engine.world),
          this.cursorPosition
        )

        if (bodiesAtCursor.length === 0) {
          return
        }
      }

      if (this.body.render.visible === false) {
        Matter.Body.setPosition(this.body, playerBody.position)
        this.body.render.visible = true
      }

      const reachedTarget = distance(this.body.position, this.cursorPosition) <= 1

      if (!reachedTarget) {
        const dir = Vec.normalise(Vec.sub(this.cursorPosition, this.body.position))
        const forceMagnitude = 0.005
        const force = Vec.mult(dir, forceMagnitude)
        Matter.Body.applyForce(this.body, this.body.position, force)
      } else {
        this.hasReachedTarget = true
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 })
        const playerToHookDirection = Vec.normalise(
          Vec.sub(this.body.position, playerBody.position)
        )
        const pullForceMagnitude = 1.5
        const pullForce = Vec.mult(playerToHookDirection, pullForceMagnitude)
        Matter.Body.applyForce(playerBody, playerBody.position, pullForce)
      }
    } else if (!isCrouching) {
      this.body.render.visible = false
    }
  }

  public override onRenderFrame(time: RenderTime) {
    super.onRenderFrame(time)

    const $game = game("client")
    if (!$game) {
      return
    }

    if (this.body.render.visible) {
      const debug = $game.debug
      const pos = Vec.add(this.body.position, camera().offset)
      this.gfx!.visible = true
      this.container!.position = pos

      if (!this.hasReachedTarget && this.cursorPosition) {
        const dx = this.cursorPosition.x - this.body.position.x
        const dy = this.cursorPosition.y - this.body.position.y
        const angle = Math.atan2(dy, dx)
        this.container!.rotation = angle
      } else {
        this.container!.rotation = this.body.angle
      }

      const alpha = debug.value ? 0.5 : 0
      this.gfx!.alpha = alpha

      if (this.sprite) {
        this.sprite.visible = this.body.render.visible
      }
    } else {
      this.gfx!.visible = false
      this.hasReachedTarget = false
      if (this.sprite) {
        this.sprite.visible = false
      }
    }
  }
}
