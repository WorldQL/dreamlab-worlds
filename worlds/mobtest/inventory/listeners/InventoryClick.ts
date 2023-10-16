import { InventoryClickEvent } from "../events/InventoryClickEvent";

export const handleInventoryClick = (event: InventoryClickEvent) => {
  console.log(`Slot at [${event.cursorSlot}] was clicked`);
};
