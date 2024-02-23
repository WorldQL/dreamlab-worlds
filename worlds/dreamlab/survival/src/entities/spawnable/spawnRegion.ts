import type { RenderTime, SpawnableContext } from '@dreamlab.gg/core'
import {
  camera,
  game,
  events as magicEvents,
} from '@dreamlab.gg/core/dist/labs'
import { Solid, SolidArgs } from '@dreamlab.gg/core/entities'
import { toRadians, Vec } from '@dreamlab.gg/core/math'
import type { SyncedValue } from '@dreamlab.gg/core/network'
import { syncedValue } from '@dreamlab.gg/core/network'
import { z } from '@dreamlab.gg/core/sdk'
import { Graphics } from 'pixi.js'
import { events } from '../../events'

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  zombieTypes: z
    .array(
      z.object({
        width: z.number(),
        height: z.number(),
        maxHealth: z.number(),
        speed: z.number(),
        knockback: z.number(),
      }),
    )
    .default([
      {
        width: 100,
        height: 200,
        maxHealth: 10,
        speed: 3,
        knockback: 1.25,
      },
    ]),
  zombiesPerWave: z.number().default(1),
  waves: z.number().default(3),
  waveInterval: z.number().default(25),
  endCooldown: z.number().default(15),
})

type zombiePosition = { x: number; y: number }[] | undefined
interface RegionData {
  isCooldown: boolean
  waveStarted: boolean
  regionActive: boolean
  positions: zombiePosition
}

export { ArgsSchema as SpawnRegionArgs }
export class SpawnRegion<A extends Args = Args> extends Solid<A> {
  private gfxCircle = new Graphics()
  private regionData: SyncedValue<RegionData> = syncedValue(
    game(),
    this.uid,
    'regionData',
    {
      isCooldown: false as boolean,
      waveStarted: false as boolean,
      regionActive: false as boolean,
      positions: undefined as zombiePosition,
    },
  )

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.isSensor = true
    this.body.label = 'spawnRegion'

    magicEvents('client')?.on('onPlayerCollisionStart', ([_player, other]) => {
      if (other.id === this.body.id) {
        events.emit('onEnterRegion', this.uid)
      }
    })

    magicEvents('client')?.on('onPlayerCollisionEnd', ([_player, other]) => {
      if (other.id === this.body.id) {
        events.emit('onExitRegion', this.uid)
      }
    })

    events.on('onRegionZombieSpawning', positions => {
      this.regionData.value.positions = Array.isArray(positions)
        ? positions
        : undefined

      setTimeout(() => {
        this.regionData.value.positions = undefined
      }, 3_000)
    })

    events.on('onRegionCooldownStart', regionId => {
      if (this.uid === regionId) {
        this.regionData.value.isCooldown = true
      }
    })

    events.on('onRegionCooldownEnd', regionId => {
      if (this.uid === regionId) {
        this.regionData.value.isCooldown = false
      }
    })

    events.on('onRegionWaveStart', regionId => {
      if (this.uid === regionId) {
        this.regionData.value.waveStarted = true
        setTimeout(() => {
          this.regionData.value.waveStarted = false
        }, 3_000)
      }
    })

    events.on('onRegionStart', regionId => {
      if (this.uid === regionId) {
        this.regionData.value.regionActive = true
      }
    })

    events.on('onRegionEnd', regionId => {
      if (this.uid === regionId) {
        this.regionData.value.regionActive = false
      }
    })
  }

  public override onRenderFrame(time: RenderTime) {
    super.onRenderFrame(time)

    const pos = Vec.add(this.transform.position, camera().offset)

    this.gfx!.clear()
    this.gfxCircle.clear()

    let fillAlpha = 0
    let fillColor = 0x0
    // const strokeAlpha = 1
    let strokeColor = 0x0
    // const strokeWidth = 8

    if (this.regionData.value.regionActive) strokeColor = 0x38761d
    if (this.regionData.value.isCooldown) {
      fillColor = 0x85c1e9
      fillAlpha = 0.5
      strokeColor = 0x3498db
    }

    if (this.regionData.value.waveStarted) {
      fillColor = 0x0
      fillAlpha = 0
      strokeColor = 0x9b0000
    }

    this.gfx?.redraw({ width: this.args.width, height: this.args.height })
    // TODO: modify redraw to include DrawOptions
    // this.gfx = drawBox(
    //   { width: this.args.width, height: this.args.height },
    //   {
    //     fill: fillColor,
    //     fillAlpha,
    //     stroke: strokeColor,
    //     strokeWidth,
    //     strokeAlpha,
    //   },
    // )

    const pulseColors = [0xff0000, 0xd10000]
    const timeBasedIndex = Math.floor(Date.now() / 250) % pulseColors.length
    const currentColor = pulseColors[timeBasedIndex]

    if (this.regionData.value.positions) {
      for (const { x, y } of Object.values(this.regionData.value.positions)) {
        const adjustedX = x + camera().offset.x
        const adjustedY = y + camera().offset.y

        this.gfxCircle.beginFill(currentColor)
        this.gfxCircle.drawCircle(adjustedX, adjustedY, 75)
        this.gfxCircle.alpha = 0.5
        this.gfxCircle.endFill()
      }
    }

    this.gfx!.position.set(pos.x, pos.y)
    this.gfx!.rotation = toRadians(this.transform.rotation)
    this.gfx!.alpha = game().debug.value ? 0.5 : 0
  }
}
