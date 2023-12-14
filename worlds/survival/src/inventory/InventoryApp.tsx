import { useInput, usePlayer } from '@dreamlab.gg/ui/react'
import type { FC } from 'https://esm.sh/react@18.2.0'
import { useCallback, useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events.js'
import Inventory from './Inventory.js'
import InventoryHotbar from './InventoryHotbar.js'
import InventoryManager from './InventoryManager.js'
import type { InventoryClickEvent } from './events/InventoryClickEvent.js'
import type {
  InventoryDragEndEvent,
  InventoryDragStartEvent,
} from './events/InventoryDragEvent.js'
import { handleInventoryClick } from './listeners/InventoryClick.js'
import {
  handleInventoryDragEnd,
  handleInventoryDragStart,
} from './listeners/InventoryDrag.js'

const isAttackAnimation = (currentAnimation: string) => {
  switch (currentAnimation) {
    case 'greatsword':
    case 'punch':
    case 'bow':
    case 'shoot':
      return true
    default:
      return false
  }
}

export const InventoryApp: FC = () => {
  const player = usePlayer()
  const [inventoryData, setInventoryData] = useState(
    InventoryManager.getInstance().getInventoryData(),
  )

  const [activeSlot, setActiveSlot] = useState<number>(0)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [sourceSlot, setSourceSlot] = useState<number | null>(null)

  const commonEventProps = {
    inventoryData,
    activeSlot,
  }

  const onInventoryOpen = useCallback(
    (pressed: boolean) => {
      if (!pressed) return
      setIsInventoryOpen(prev => !prev)
    },
    [setIsInventoryOpen],
  )

  const onInventoryDigits = useCallback(
    (digit: number, pressed: boolean) => {
      if (!pressed || !player) return
      if (isAttackAnimation(player.currentAnimation)) return
      const idx = digit - 1
      setActiveSlot(idx)
      player.setGear(inventoryData[idx]?.baseGear)
    },
    [player, inventoryData, setActiveSlot],
  )

  useEffect(() => {
    const updateInventory = () => {
      const invData = InventoryManager.getInstance().getInventoryData()
      setInventoryData([...invData])
      player?.setGear(invData[activeSlot]?.baseGear)
    }

    events.addListener('onInventoryUpdate', updateInventory)

    return () => {
      events.removeListener('onInventoryUpdate', updateInventory)
    }
  }, [activeSlot, inventoryData, player])

  useInput('@inventory/open', onInventoryOpen)
  for (let index = 0; index <= 9; index++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInput(`@inventory/digit${index}`, (va: boolean) =>
      onInventoryDigits(index, va),
    )
  }

  const handleClick = (slotIndex: number) => {
    const event: InventoryClickEvent = {
      ...commonEventProps,
      cursorSlot: slotIndex,
    }
    handleInventoryClick(event)
  }

  const handleDragStartEvent = (slotIndex: number) => {
    const event: InventoryDragStartEvent = {
      ...commonEventProps,
      cursorSlot: slotIndex,
      setSourceSlot,
    }
    handleInventoryDragStart(event)
  }

  const handleDragEndEvent = (slotIndex: number) => {
    if (sourceSlot === null || !player) return
    if (sourceSlot === slotIndex) {
      setSourceSlot(null)
      return
    }

    InventoryManager.getInstance().swapItems(sourceSlot, slotIndex)
    setInventoryData([...InventoryManager.getInstance().getInventoryData()])

    const event: InventoryDragEndEvent = {
      ...commonEventProps,
      player,
      cursorSlot: slotIndex,
      sourceSlot,
      targetSlot: slotIndex,
    }
    handleInventoryDragEnd(event)

    setSourceSlot(null)
  }

  return (
    <>
      {!player ? (
        <div>Loading...</div>
      ) : (
        <>
          <InventoryHotbar
            activeSlot={activeSlot}
            inventoryData={inventoryData}
          />
          {isInventoryOpen && (
            <Inventory
              data={inventoryData}
              onClick={handleClick}
              onDragEnd={handleDragEndEvent}
              onDragStart={handleDragStartEvent}
            />
          )}
        </>
      )}
    </>
  )
}
