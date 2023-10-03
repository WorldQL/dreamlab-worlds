import { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'

export type InventorySlot = PlayerInventoryItem | undefined

export type InventoryData = InventorySlot[][]
