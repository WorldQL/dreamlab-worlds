import { Player, isPlayer } from '@dreamlab.gg/core/dist/entities'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'https://esm.sh/react@18.2.0'
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

  const onInventoryOpen = useCallback(
    (pressed: boolean) => {
      if (!pressed) return
      setIsInventoryOpen(prev => !prev)
    },
    [setIsInventoryOpen],
  )

  const onInventoryDigit = useCallback(
    (digit: number, pressed: boolean) => {
      if (!pressed) return

      const idx = digit - 1
      setActiveSlot(idx)
      player.inventory.setItemInHand(data[idx])
    },
    [player, data, setActiveSlot],
  )

  // #region The following code is ugly but is required for memoisation for event listeners to work properly in react
  // prettier-ignore
  const onDigit0 = useCallback((v: boolean) => onInventoryDigit(0, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit1 = useCallback((v: boolean) => onInventoryDigit(1, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit2 = useCallback((v: boolean) => onInventoryDigit(2, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit3 = useCallback((v: boolean) => onInventoryDigit(3, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit4 = useCallback((v: boolean) => onInventoryDigit(4, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit5 = useCallback((v: boolean) => onInventoryDigit(5, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit6 = useCallback((v: boolean) => onInventoryDigit(6, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit7 = useCallback((v: boolean) => onInventoryDigit(7, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit8 = useCallback((v: boolean) => onInventoryDigit(8, v), [onInventoryDigit])
  // prettier-ignore
  const onDigit9 = useCallback((v: boolean) => onInventoryDigit(9, v), [onInventoryDigit])

  useEffect(() => {
    game.client.inputs.addListener('@inventory/open', onInventoryOpen)
    game.client.inputs.addListener('@inventory/digit0', onDigit0)
    game.client.inputs.addListener('@inventory/digit1', onDigit1)
    game.client.inputs.addListener('@inventory/digit2', onDigit2)
    game.client.inputs.addListener('@inventory/digit3', onDigit3)
    game.client.inputs.addListener('@inventory/digit4', onDigit4)
    game.client.inputs.addListener('@inventory/digit5', onDigit5)
    game.client.inputs.addListener('@inventory/digit6', onDigit6)
    game.client.inputs.addListener('@inventory/digit7', onDigit7)
    game.client.inputs.addListener('@inventory/digit8', onDigit8)
    game.client.inputs.addListener('@inventory/digit9', onDigit9)

    return () => {
      game.client.inputs.removeListener('@inventory/open', onInventoryOpen)
      game.client.inputs.removeListener('@inventory/digit0', onDigit0)
      game.client.inputs.removeListener('@inventory/digit1', onDigit1)
      game.client.inputs.removeListener('@inventory/digit2', onDigit2)
      game.client.inputs.removeListener('@inventory/digit3', onDigit3)
      game.client.inputs.removeListener('@inventory/digit4', onDigit4)
      game.client.inputs.removeListener('@inventory/digit5', onDigit5)
      game.client.inputs.removeListener('@inventory/digit6', onDigit6)
      game.client.inputs.removeListener('@inventory/digit7', onDigit7)
      game.client.inputs.removeListener('@inventory/digit8', onDigit8)
      game.client.inputs.removeListener('@inventory/digit9', onDigit9)
    }
  }, [
    onInventoryOpen,
    onDigit0,
    onDigit1,
    onDigit2,
    onDigit3,
    onDigit4,
    onDigit5,
    onDigit6,
    onDigit7,
    onDigit8,
    onDigit9,
  ])
  // #endregion

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
