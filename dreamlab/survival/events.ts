import type { Player } from "@dreamlab.gg/core/entities"
import { EventEmitter } from "@dreamlab.gg/core/events"
import type { InventoryItem } from "./inventory/inventoryManager.ts"
import { Quest } from "./playerManager.ts"

interface WorldEvents {
  onPlayerKill: [{ x: number; y: number }]
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, InventoryItem | undefined]
  onPlayerNearHealingItem: [number | undefined]
  onInventoryUpdate: []

  onGoldUpdate: []
  onGoldPickup: [number]

  onEnterRegion: [string]
  onExitRegion: [string]

  onRegionStart: [string]
  onRegionEnd: [string]
  onRegionWaveStart: [string]
  onRegionCooldownStart: [string]
  onRegionCooldownEnd: [string]
  onRegionZombieSpawning: [{ x: number; y: number }[]]

  onPromptTrigger: [string | undefined]

  onQuestTrigger: [string | undefined, string | undefined, number | undefined]
  onQuestAccepted: [Quest]
  onQuestCompleted: [Quest]
}

export const events = new EventEmitter<Events>()

type Events = WorldEvents
export type Event<E extends {} = Events> = keyof E

export type EventArgs<T extends Event<E>, E extends {} = Events> = T extends keyof E
  ? E[T] extends unknown[]
    ? E[T]
    : never
  : never

export type MyEventHandler<T extends Event<E>, E extends {} = Events> = (
  ...args: EventArgs<T, E>
) => void
