import type { RenderTime, SpawnableContext } from '@dreamlab.gg/core'
import {
  camera,
  debug,
  game,
  events as magicEvent,
} from '@dreamlab.gg/core/dist/labs'
import { Solid, SolidArgs } from '@dreamlab.gg/core/entities'
import { createGear } from '@dreamlab.gg/core/managers'
import { Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { events } from '../../events'
import { ProjectileTypes } from '../../inventory/inventoryManager'
import type { InventoryItem } from '../../inventory/inventoryManager'

const projectileTypeValues = Object.values(ProjectileTypes).filter(
  value => typeof value === 'string',
) as [string, ...string[]]

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  displayName: z.string().default('Default Item'),
  animationName: z
    .enum(['bow', 'shoot', 'greatsword', 'idle', 'jump', 'jog', 'walk'])
    .default('shoot'),
  damage: z.number().default(1),
  range: z.number().default(1),
  lore: z.string().default('Default Item Lore'),
  bone: z.enum(['handLeft', 'handRight']).default('handRight'),
  anchorX: z.number().default(0.5),
  anchorY: z.number().default(0.5),
  rotation: z.number().default(0),
  speedMultiplier: z.number().optional().default(1),
  projectileType: z.enum(projectileTypeValues).default('NONE'),
})

export { ArgsSchema as InventoryItemArgs }
export class Item<A extends Args = Args> extends Solid<A> {
  private time = 0
  private floatHeight = 5
  private rotationSpeed = 0.006

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)

    this.body.isSensor = true
    this.body.isStatic = true
    this.body.label = 'inventoryItem'

    const $game = game()

    magicEvent('client')?.on('onPlayerCollisionStart', ([player, other]) => {
      if (this.body && other === this.body && $game.client) {
        const baseGear = {
          displayName: this.args.displayName,
          textureURL: this.args.spriteSource?.url ?? '',
          animationName: this.args.animationName,
          anchor: { x: this.args.anchorX, y: this.args.anchorY },
          rotation: this.args.rotation,
          bone: this.args.bone,
          speedMultiplier: this.args.speedMultiplier,
        }

        const newItem = createGear(baseGear)

        const inventoryItem: InventoryItem = {
          baseGear: newItem,
          lore: this.args.lore,
          damage: this.args.damage,
          range: this.args.range,
          value: 100,
          projectileType:
            ProjectileTypes[
              this.args.projectileType as keyof typeof ProjectileTypes
            ],
        }

        events.emit('onPlayerNearItem', player, inventoryItem)
      }
    })

    magicEvent('client')?.on('onPlayerCollisionEnd', ([player, other]) => {
      if (this.body && other === this.body && $game.client) {
        events.emit('onPlayerNearItem', player, undefined)
      }
    })
  }

  public override onRenderFrame(_time: RenderTime) {
    // super.onRenderFrame(time)
    this.time += 0.05

    const yOffset = Math.sin(this.time) * this.floatHeight
    const pos = Vec.add(this.transform.position, camera().offset)
    pos.y += yOffset

    this.container!.rotation += this.rotationSpeed
    this.container!.position = pos

    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0
  }
}
