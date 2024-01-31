import type { InventoryClickEvent } from '../events/inventoryClickEvent'

export const handleInventoryClick = (event: InventoryClickEvent) => {
  console.log(`Slot at [${event.cursorSlot}] was clicked`)
}
