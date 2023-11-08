import type { Player } from '@dreamlab.gg/core/dist/entities'

export interface InventoryEvent {
  player: Player
  activeSlot: number // the item slot that the player is currently holding
  cursorSlot: number // the slot that is being interacted with
}
