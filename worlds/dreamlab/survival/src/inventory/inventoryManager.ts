import type { BaseGear, Gear } from '@dreamlab.gg/core/dist/managers'
import { events } from '../events'

export enum ProjectileTypes {
  BURST_SHOT = 'BURST_SHOT',
  DOUBLE_SCATTER_SHOT = 'DOUBLE_SCATTER_SHOT',
  DOUBLE_SHOT = 'DOUBLE_SHOT',
  SCATTER_SHOT = 'SCATTER_SHOT',
  SINGLE_SHOT = 'SINGLE_SHOT',
}

export interface InventoryItem {
  baseGear: Gear
  lore: string
  damage: number
  value: number | undefined // gold value
  projectileType?: ProjectileTypes
}

export type InventoryData = (InventoryItem | undefined)[]
const TOTAL_SLOTS = 36

class InventoryManager {
  private static instance: InventoryManager
  private inventoryData: InventoryData

  private constructor() {
    this.inventoryData = Array.from({ length: TOTAL_SLOTS }).fill(
      undefined,
    ) as InventoryData
  }

  public static getInstance(): InventoryManager {
    if (!InventoryManager.instance) {
      InventoryManager.instance = new InventoryManager()
    }

    return InventoryManager.instance
  }

  public getInventoryData(): InventoryData {
    return this.inventoryData
  }

  public setInventoryData(data: InventoryData): void {
    this.inventoryData = data
    events.emit('onInventoryUpdate')
  }

  public addItemToInventory(newItem: InventoryItem): void {
    const slotIndex = this.inventoryData.indexOf(undefined)
    if (slotIndex !== -1) {
      this.inventoryData[slotIndex] = newItem
      events.emit('onInventoryUpdate')
    } else {
      console.warn('No empty slot available to add the item.')
    }
  }

  public swapItems(sourceSlotIndex: number, targetSlotIndex: number): void {
    const temp = this.inventoryData[sourceSlotIndex]
    this.inventoryData[sourceSlotIndex] = this.inventoryData[targetSlotIndex]
    this.inventoryData[targetSlotIndex] = temp
    events.emit('onInventoryUpdate')
  }

  public getInventoryItemFromBaseGear(baseGear: BaseGear) {
    for (const item of this.inventoryData) {
      if (item?.baseGear === baseGear) return item
    }

    return undefined
  }
}

export default InventoryManager
