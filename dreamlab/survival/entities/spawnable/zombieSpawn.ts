import { isSpawnableEntity, type SpawnableContext } from "@dreamlab.gg/core"
import { SyncedValue, syncedValue } from "@dreamlab.gg/core/dist/network"
import { NonSolid, NonSolidArgs } from "@dreamlab.gg/core/entities"
import { z } from "@dreamlab.gg/core/sdk"
import { Zombie } from "./zombie.ts"
import { game } from "@dreamlab.gg/core/dist/labs"

type Args = typeof ArgsSchema
const ArgsSchema = NonSolidArgs.extend({
  cooldown: z.number().positive().default(60),
  zombieTypes: z
    .array(
      z.object({
        width: z.number(),
        height: z.number(),
        maxHealth: z.number(),
        speed: z.number(),
        knockback: z.number()
      })
    )
    .default([
      {
        width: 100,
        height: 200,
        maxHealth: 10,
        speed: 3,
        knockback: 1.25
      }
    ])
})

interface SpawnData {
  zombies: string[]
  zombieTypes: {
    width: number
    height: number
    maxHealth: number
    speed: number
    knockback: number
  }[]
  cooldownTimer: number
}

export { ArgsSchema as ZombieSpawnArgs }
export class ZombieSpawn<A extends Args = Args> extends NonSolid<A> {
  private spawnData: SyncedValue<SpawnData> = syncedValue(this.uid, "spawnData", {
    zombies: [],
    zombieTypes: this.args.zombieTypes,
    cooldownTimer: 0
  })

  private checkInterval: ReturnType<typeof setTimeout> | null = null

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx, { stroke: "green" })
    this.startCheckInterval()
  }

  private spawnZombies() {
    const randomZombieTypeIndex = Math.floor(
      Math.random() * this.spawnData.value.zombieTypes.length
    )
    const randomZombieType = this.spawnData.value.zombieTypes[randomZombieTypeIndex]

    const zombie = game("server")?.spawn({
      entity: "@cvz/ZombieMob",
      args: randomZombieType as Record<string, unknown>,
      transform: {
        position: [this.transform.position.x, this.transform.position.y],
        zIndex: 5
      },
      tags: ["net/replicated", "net/server-authoritative", "editor/doNotSave"]
    }) as Zombie

    if (zombie) {
      this.spawnData.value.zombies.push(zombie.uid)
    }
  }

  private startCheckInterval() {
    this.spawnZombies()
    this.checkInterval = setInterval(() => {
      const aliveZombies = this.spawnData.value.zombies.filter(uid =>
        game().entities.some(entity => isSpawnableEntity(entity) && entity.uid === uid)
      )

      this.spawnData.value.zombies = aliveZombies

      if (aliveZombies.length === 0) {
        if (this.spawnData.value.cooldownTimer <= 0) {
          this.spawnZombies()
          this.spawnData.value.cooldownTimer = this.args.cooldown
        } else {
          this.spawnData.value.cooldownTimer -= 10
        }
      }
    }, 10000)
  }

  public override teardown(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    super.teardown()
  }
}
