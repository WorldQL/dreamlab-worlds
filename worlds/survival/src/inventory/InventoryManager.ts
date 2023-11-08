import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import { events } from '../events'

export interface ProjectileOptions {
  projectiles: number
  explosive: boolean
}

export interface InventoryItem {
  baseItem: PlayerItem
  damage: number
  projectileOptions?: ProjectileOptions
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
}

export default InventoryManager
