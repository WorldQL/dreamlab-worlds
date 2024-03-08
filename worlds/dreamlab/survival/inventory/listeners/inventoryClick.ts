import type { InventoryClickEvent } from "../events/inventoryClickEvent.ts";

export const handleInventoryClick = (event: InventoryClickEvent) => {
  console.log(`Slot at [${event.cursorSlot}] was clicked`);
};
