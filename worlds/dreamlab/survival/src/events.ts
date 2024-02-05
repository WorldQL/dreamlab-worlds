import type { Player } from '@dreamlab.gg/core/entities'
import { EventEmitter } from '@dreamlab.gg/core/events'
import type { InventoryItem } from './inventory/inventoryManager'

interface Events {
  onPlayerScore: [number]
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, InventoryItem | undefined]
  onInventoryUpdate: []
  onGoldUpdate: []

  onEnterRegion: [string]
  onExitRegion: [string]

  onRegionStart: [string]
  onRegionEnd: [string]
  onRegionWaveStart: [string]
  onRegionCooldownStart: [string]
  onRegionCooldownEnd: [string]
  onRegionZombieSpawning: [{ x: number; y: number }[]]
}

export const events = new EventEmitter<Events>()
