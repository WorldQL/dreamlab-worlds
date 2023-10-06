import { Player } from '@dreamlab.gg/core/dist/entities'
import { InventoryData } from '../inventoryManager'

export interface InventoryEvent {
  data: InventoryData
  player: Player
  activeSlot: number // the item slot that the player is currently holding
  cursorSlot: number // the slot that is being interacted with
}