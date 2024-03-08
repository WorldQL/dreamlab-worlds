import type { ArgsPath, PreviousArgs, RenderTime, SpawnableContext, Time } from "@dreamlab.gg/core"
import { SpawnableEntity } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import {
  camera,
  debug,
  game,
  events as magicEvents,
  physics,
  stage
} from "@dreamlab.gg/core/dist/labs"
import { z } from "@dreamlab.gg/core/dist/sdk"
import { SpriteSourceSchema } from "@dreamlab.gg/core/dist/textures"
import { isNetPlayer } from "@dreamlab.gg/core/entities"
import type { Bounds, Vector } from "@dreamlab.gg/core/math"
import { simpleBoundsTest, toRadians, Vec } from "@dreamlab.gg/core/math"
import { onlyNetClient, onlyNetServer, syncedValue } from "@dreamlab.gg/core/network"
import type {
  MessageListenerServer,
  NetClient,
  NetServer,
  SyncedValue
} from "@dreamlab.gg/core/network"
import type { BoxGraphics, CircleGraphics } from "@dreamlab.gg/core/utils"
import { deferUntilPhysicsStep, drawBox, drawCircle } from "@dreamlab.gg/core/utils"
import Matter from "matter-js"
import type { Resource, Texture } from "pixi.js"
import { AnimatedSprite, Container } from "pixi.js"
import { getPreloadedAssets } from "../../assetLoader.ts"
import { events } from "../../events.ts"
import InventoryManager from "../../inventory/inventoryManager.ts"

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(200),
  height: z.number().positive().min(1).default(200),
  spriteSource: SpriteSourceSchema.optional(),
  maxHealth: z.number().positive().min(1).default(10),
  speed: z.number().positive().min(1).default(1),
  knockback: z.number().positive().min(0).default(2)
})

type zombieAnimations = "punch" | "recoil" | "walk"
type OnPlayerAttack = EventHandler<"onPlayerAttack">
type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">

interface MobData {
  health: number
  direction: number
  hitCooldown: number
  patrolDistance: number
  currentAnimation: zombieAnimations
  directionCooldown: number
}

export { ArgsSchema as ZombieArgs }
export class Zombie<A extends Args = Args> extends SpawnableEntity<A> {
  protected readonly body: Matter.Body
  protected sprite: AnimatedSprite | undefined

  protected readonly container: Container | undefined
  protected readonly healthContainer: Container | undefined
  protected readonly gfx: BoxGraphics | undefined
  protected readonly gfxHitBox: CircleGraphics | undefined
  protected readonly gfxHealthBorder: BoxGraphics | undefined
  protected readonly gfxHealthAmount: BoxGraphics | undefined

  protected onPlayerAttack: OnPlayerAttack | undefined
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  protected onHitServer: MessageListenerServer | undefined

  protected netServer: NetServer | undefined
  protected netClient: NetClient | undefined

  private HIT_CHANNEL = "@cvz/Hittable/hit"
  private patrolDistance = 300
  private hitCooldown = 0.5 // Second(s)
  private zombieAnimations: Record<string, Texture<Resource>[]> = {}
  private mobData: SyncedValue<MobData> = syncedValue(this.uid, "mobData", {
    health: this.args.maxHealth,
    direction: 1,
    hitCooldown: 0,
    patrolDistance: 0,
    currentAnimation: "walk" as zombieAnimations,
    directionCooldown: 0
  })

  public constructor(ctx: SpawnableContext<A>, { stroke = "green" }: { stroke?: string } = {}) {
    super(ctx)

    this.body = Matter.Bodies.rectangle(
      this.transform.position.x,
      this.transform.position.y,
      this.args.width,
      this.args.height,
      {
        label: "zombie",
        inertia: Number.POSITIVE_INFINITY
      }
    )

    if (!this.tags.includes("net/replicated")) {
      this.tags.push("net/replicated", "net/server-authoritative", "editor/doNotSave")
    }

    this.netServer = onlyNetServer(game())
    this.netClient = onlyNetClient(game())

    physics().register(this, this.body)
    physics().linkTransform(this.body, this.transform)

    // onPlayerAttack listener
    this.onPlayerAttack = async (player, gear) => {
      if (
        this.mobData.value.hitCooldown > 0 ||
        ["bow", "shoot"].includes(gear?.animationName || "")
      ) {
        return
      }

      const playerPositionX = player.body.position.x
      const mobPositionX = this.body.position.x
      const xDiff = playerPositionX - mobPositionX

      let damage = 1
      let range = this.args.width / 2 + 120

      if (gear) {
        const inventoryManager = InventoryManager.getInstance()
        const inventoryItem = inventoryManager.getInventoryItemFromBaseGear(gear)

        if (inventoryItem) {
          damage = inventoryItem.damage
          range *= Math.max(inventoryItem.range, 1)
        }
      }

      if (Math.abs(xDiff) <= range) {
        await this.netClient?.sendCustomMessage(this.HIT_CHANNEL, {
          uid: this.uid,
          damage
        })

        if (this.mobData.value.health - damage <= 0) {
          events.emit("onPlayerScore", this.args.maxHealth * 25)
        }
      }
    }

    // onPlayerCollisionStart
    this.onPlayerCollisionStart = ([player, other]) => {
      if (this.body && other === this.body) {
        const heightDifference = player.body.position.y - this.body.position.y

        const mobHeight = this.body.bounds.max.y - this.body.bounds.min.y
        const threshold = mobHeight
        if (heightDifference < -threshold) {
          const damage = 2
          void this.netClient?.sendCustomMessage(this.HIT_CHANNEL, {
            uid: this.uid,
            damage
          })
          const bounceForce = { x: 0, y: -4 }
          deferUntilPhysicsStep(() => {
            Matter.Body.applyForce(player.body, player.body.position, bounceForce)
          })
        } else {
          events.emit("onPlayerDamage", 1)
          const forceDirection = this.mobData.value.direction
          const forceMagnitude = 4 * forceDirection
          deferUntilPhysicsStep(() => {
            Matter.Body.applyForce(player.body, player.body.position, {
              x: forceMagnitude,
              y: -1
            })
          })
        }
      }
    }

    this.onHitServer = async ({ peerID }, _, data) => {
      if (!this.netServer) throw new Error("missing network")

      const { uid: dataUid, damage, direction } = data
      if (dataUid !== this.uid || typeof damage !== "number" || typeof direction !== "number")
        return

      const player = game().entities.find(ev => isNetPlayer(ev) && ev.connectionId === peerID)
      if (!player) throw new Error("missing netplayer")
      if (this.mobData.value.hitCooldown > 0) return

      this.mobData.value.hitCooldown = this.hitCooldown * 60
      Matter.Body.applyForce(this.body, this.body.position, {
        x: this.args.knockback * direction,
        y: -1.75
      })

      this.mobData.value.health -= damage
      if (this.mobData.value.health <= 0) game().destroy(this as unknown as SpawnableEntity)
    }

    this.netServer?.addCustomMessageListener(this.HIT_CHANNEL, this.onHitServer)

    magicEvents("client")?.on("onPlayerCollisionStart", this.onPlayerCollisionStart)
    magicEvents("common")?.on("onPlayerAttack", this.onPlayerAttack)

    // render animations, sprite, and graphics
    const $game = game("client")
    if ($game) {
      const assets = getPreloadedAssets()
      this.zombieAnimations.walk = assets.walkTextures
      this.zombieAnimations.recoil = assets.recoilTextures
      this.zombieAnimations.punch = assets.punchTextures
      this.sprite = new AnimatedSprite(this.zombieAnimations.walk!)
      this.sprite.gotoAndPlay(0)
      this.sprite.anchor.set(0.45, 0.535)

      const originalWidth = this.sprite.texture.width
      const originalHeight = this.sprite.texture.height
      const scaleX = (this.args.width * 1.5) / originalWidth
      const scaleY = (this.args.height * 1.5) / originalHeight
      const uniformScale = Math.max(scaleX, scaleY)

      this.sprite.scale.set(uniformScale, uniformScale)
      this.sprite.zIndex = this.transform.zIndex

      this.container = new Container()
      this.container.sortableChildren = true
      this.container.zIndex = this.transform.zIndex

      this.healthContainer = new Container()
      this.healthContainer.sortableChildren = true

      this.healthContainer.zIndex = 1
      this.healthContainer.position.y = -this.args.height / 2 - 30

      this.gfx = drawBox({ width: this.args.width, height: this.args.height }, { stroke })

      this.gfxHitBox = drawCircle(
        { radius: this.args.width / 2 + 120 },
        { fill: "red", fillAlpha: 1, strokeAlpha: 0 }
      )

      this.gfxHitBox!.zIndex = -1
      this.gfxHealthAmount = drawBox(
        {
          width: (this.mobData.value.health / this.args.maxHealth) * this.args.width + 50,
          height: 20
        },
        { fill: "red", fillAlpha: 1, strokeAlpha: 0 }
      )

      this.gfxHealthBorder = drawBox(
        { width: this.args.width + 50, height: 20 },
        {
          fill: "white",
          stroke: "black",
          fillAlpha: 1,
          strokeAlign: 1,
          strokeWidth: 4
        }
      )

      this.healthContainer.addChild(this.gfxHealthBorder)
      this.healthContainer.addChild(this.gfxHealthAmount)

      this.container.addChild(this.gfx)
      this.container.addChild(this.gfxHitBox)
      this.container.addChild(this.healthContainer)
      if (this.sprite) stage().addChild(this.sprite)
      stage().addChild(this.container)

      this.transform.addZIndexListener(() => {
        if (this.container) this.container.zIndex = this.transform.zIndex
      })
    }
  }

  public override bounds(): Bounds | undefined {
    const { width, height } = this.args
    return { width, height }
  }

  public override isPointInside(point: Vector): boolean {
    const { width, height } = this.args
    return simpleBoundsTest({ width, height }, this.transform, point)
  }

  public override onArgsUpdate(path: ArgsPath<Args>, previous: PreviousArgs<Args>): void {
    if (path === "width" || path === "height") {
      const { width: originalWidth, height: originalHeight } = previous
      const { width, height } = this.args

      const scaleX = width / originalWidth
      const scaleY = height / originalHeight

      Matter.Body.setAngle(this.body, 0)
      Matter.Body.scale(this.body, scaleX, scaleY)
      Matter.Body.setAngle(this.body, toRadians(this.transform.rotation))

      this.gfx?.redraw(this.args)
      this.gfxHitBox?.redraw({ radius: this.args.width / 2 + 120 })
      this.gfxHealthBorder?.redraw({ width: this.args.width + 50, height: 20 })

      if (this.healthContainer) this.healthContainer.position.y = -this.args.height / 2 - 30

      if (this.sprite) {
        this.sprite.width = width
        this.sprite.height = height
      }
    }
  }

  public override onResize(bounds: Bounds): void {
    this.args.width = bounds.width
    this.args.height = bounds.height
  }

  public override teardown(): void {
    physics().unregister(this, this.body)
    this.container?.destroy({ children: true })
    this.sprite?.destroy()

    magicEvents().common.removeListener("onPlayerAttack", this.onPlayerAttack)
    magicEvents().client?.removeListener("onPlayerCollisionStart", this.onPlayerCollisionStart)

    if (this.onHitServer)
      this.netServer?.removeCustomMessageListener(this.HIT_CHANNEL, this.onHitServer)
  }

  public override async onPhysicsStep(_: Time): Promise<void> {
    if (game().client) return

    Matter.Body.setAngle(this.body, 0)
    Matter.Body.setAngularVelocity(this.body, 0)

    this.mobData.value.hitCooldown = Math.max(0, this.mobData.value.hitCooldown - 1)
    this.mobData.value.directionCooldown = Math.max(0, this.mobData.value.directionCooldown - 1)

    let closestPlayer: Matter.Body | null = null
    let minDistance = Number.POSITIVE_INFINITY

    const searchArea = {
      min: { x: this.body.position.x - 5_000, y: this.body.position.y - 5_000 },
      max: { x: this.body.position.x + 5_000, y: this.body.position.y + 5_000 }
    }

    const playerBodies = game().entities.flatMap(entity =>
      isNetPlayer(entity) && entity.body ? [entity.body] : []
    )
    const playersInRegion = Matter.Query.region(playerBodies, searchArea)

    for (const player of playersInRegion) {
      const dx = player.position.x - this.body.position.x
      const dy = player.position.y - this.body.position.y
      const distanceSquared = dx * dx + dy * dy

      if (distanceSquared < minDistance) {
        minDistance = distanceSquared
        closestPlayer = player
      }
    }

    minDistance = Math.sqrt(minDistance)

    if (this.mobData.value.hitCooldown > 0) {
      this.mobData.value.currentAnimation = "recoil"
    } else if (closestPlayer && minDistance < 150) {
      this.mobData.value.currentAnimation = "punch"
    } else if (this.mobData.value.currentAnimation !== "walk") {
      this.mobData.value.currentAnimation = "walk"
    }

    if (closestPlayer && minDistance < 2_000) {
      const verticalDistance = Math.abs(closestPlayer.position.y - this.body.position.y)
      const horizontalDistance = Math.abs(closestPlayer.position.x - this.body.position.x)

      if (verticalDistance < horizontalDistance && this.mobData.value.directionCooldown === 0) {
        this.mobData.value.direction = closestPlayer.position.x > this.body.position.x ? 1 : -1
        this.mobData.value.directionCooldown = 1
      }

      Matter.Body.translate(this.body, {
        x: this.args.speed * this.mobData.value.direction,
        y: 0
      })
    } else {
      // patrol back and fourth when player is far from entity
      if (this.mobData.value.patrolDistance > this.patrolDistance) {
        this.mobData.value.patrolDistance = 0
        this.mobData.value.direction *= -1
      }

      Matter.Body.translate(this.body, {
        x: (this.args.speed / 2) * this.mobData.value.direction,
        y: 0
      })

      this.mobData.value.patrolDistance += Math.abs(this.args.speed / 2)
    }

    if (!closestPlayer || minDistance > 5_000) {
      game().destroy(this as SpawnableEntity)
    }
  }

  public override onRenderFrame(_: RenderTime): void {
    const pos = Vec.add(this.transform.position, camera().offset)

    if (this.sprite) {
      this.sprite.scale.x = -this.mobData.value.direction

      this.sprite.position = pos
      if (this.sprite.textures !== this.zombieAnimations[this.mobData.value.currentAnimation]) {
        this.sprite.textures = this.zombieAnimations[this.mobData.value.currentAnimation]!
        this.sprite.gotoAndPlay(0)
      }
    }

    if (this.container) {
      this.container.position = pos
      this.container.angle = this.transform.rotation
    }

    const alpha = debug() ? 0.5 : 0
    if (this.gfx) this.gfx.alpha = alpha
    if (this.gfxHitBox) this.gfxHitBox.alpha = this.mobData.value.hitCooldown === 0 ? alpha / 3 : 0

    this.gfxHealthAmount?.redraw({
      width: (this.mobData.value.health / this.args.maxHealth) * this.args.width + 50,
      height: 20
    })
  }
}
