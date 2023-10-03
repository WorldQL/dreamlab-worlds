import { Item } from '@dreamlab.gg/core/dist/managers'
import { Texture } from 'pixi.js'


export type InventorySlot = Item | undefined

export type InventoryData = InventorySlot[][]
