import { Texture } from 'pixi.js'

export interface Item {
  id: string
  displayName: string
  texture: Texture
}

export type InventorySlot = Item | undefined

export type InventoryData = InventorySlot[][]
