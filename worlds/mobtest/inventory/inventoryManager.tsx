import { Player, isPlayer } from '@dreamlab.gg/core/dist/entities'
import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import Inventory from './Inventory.js'
import { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { handleInventoryClick } from './listeners/InventoryClick.js'
import {
  handleInventoryDragStart,
  handleInventoryDragEnd,
} from './listeners/InventoryDrag.js'
import { InventoryClickEvent } from './events/inventoryClickEvent.js'
import {
  InventoryDragStartEvent,
  InventoryDragEndEvent,
} from './events/inventoryDragEvent.js'

export type InventoryData = PlayerInventoryItem[]
const TOTAL_SLOTS = 36

const InventoryApp: React.FC<{ game: any; player: Player }> = ({
  game,
  player,
}) => {
  const initialData = Array(TOTAL_SLOTS).fill(undefined)
  const [data, setData] = useState<InventoryData>(initialData)
  const [activeSlot, setActiveSlot] = useState<number>(0)
  const [sourceSlot, setSourceSlot] = useState<number | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)

  const commonEventProps = {
    data,
    player,
    activeSlot,
  }

  // fill local inventory with player.inventory
  useEffect(() => {
    const playerItems = player.inventory.getItems()
    setData(prev => {
      const newData = [...prev]
      playerItems.forEach((item: PlayerInventoryItem, index: number) => {
        newData[index] = item
      })
      return newData
    })
  }, [player])

  // handles switching current item in hand
  useEffect(() => {
    const handleDigitInput = () => {
      Array.from({ length: 9 }, (_, i) => {
        if (game.client?.inputs.getInput(`@inventory/digit${i + 1}`)) {
          setActiveSlot(i)
          player.inventory.setItemInHand(data[i])
        }
      })
      requestAnimationFrame(handleDigitInput)
    }
    handleDigitInput()
  }, [game, player, data])

  // handles opening the inventory
  useEffect(() => {
    let lastToggleTime = 0
    const toggleDelay = 200
    const checkInputAndOpenInventory = () => {
      const shouldOpenInventory =
        game.client?.inputs?.getInput('@inventory/open') ?? false
      const currentTime = Date.now()
      if (shouldOpenInventory && currentTime - lastToggleTime > toggleDelay) {
        setIsInventoryOpen(prev => !prev)
        lastToggleTime = currentTime
      }
      requestAnimationFrame(checkInputAndOpenInventory)
    }
    checkInputAndOpenInventory()
  }, [game])

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
      setData,
    }
    handleInventoryDragStart(event)
  }

  const handleDragEndEvent = (slotIndex: number) => {
    if (sourceSlot === null) return
    if (sourceSlot === slotIndex) {
      setSourceSlot(null)
      return
    }

    const event: InventoryDragEndEvent = {
      ...commonEventProps,
      cursorSlot: slotIndex,
      sourceSlot,
      targetSlot: slotIndex,
      setData,
    }
    handleInventoryDragEnd(event)
    setSourceSlot(null)
  }

  return isInventoryOpen ? (
    <Inventory
      data={data}
      onClick={handleClick}
      onDragStart={handleDragStartEvent}
      onDragEnd={handleDragEndEvent}
    />
  ) : null
}

export const initializeGameUI = (game: any) => {
  const registerInput = (input: string, key: string) =>
    game.client?.inputs.registerInput(input, key)

  const digits = Array.from({ length: 9 }, (_, i) => 'digit' + (i + 1))
  const keys = [
    'KeyQ',
    ...Array.from({ length: 9 }, (_, i) => 'Digit' + (i + 1)),
  ]

  ;['open', ...digits].forEach((input, i) =>
    registerInput(`@inventory/${input}`, keys[i]),
  )

  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(
        <InventoryApp game={game} player={entity} />,
      )
    }
  })
}
