import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import type { KeyCode } from '@dreamlab.gg/core/dist/input'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'https://esm.sh/react@18.2.0'
import Inventory from './Inventory.js'
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

export type InventoryData = (PlayerInventoryItem | undefined)[]
const TOTAL_SLOTS = 36

// TODO: fix this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GameContext = createContext<any | null>(null)

const useGameEventListener = (
  source: 'common' | 'inputs',
  event: unknown,
  handler: unknown,
) => {
  const game = useContext(GameContext)

  useEffect(() => {
    switch (source) {
      case 'inputs':
        game.client.inputs.addListener(event, handler)
        return () => game.client.inputs.removeListener(event, handler)
      case 'common':
        game.events.common.addListener(event, handler)
        return () => game.events.common.removeListener(event, handler)
      default:
        throw new Error(`Unsupported event source: ${source}`)
    }
  }, [source, event, handler, game])
}

const InventoryApp: React.FC<{ player: Player }> = ({ player }) => {
  const [data, setData] = useState<InventoryData>(
    Array.from({ length: TOTAL_SLOTS }).fill(undefined) as InventoryData,
  )
  const [activeSlot, setActiveSlot] = useState<number>(0)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [sourceSlot, setSourceSlot] = useState<number | null>(null)

  const commonEventProps = {
    data,
    player,
    activeSlot,
  }

  useEffect(() => {
    const playerItems = player.inventory.getItems()
    setData(prev => {
      const newData = [...prev]

      for (const [index, item] of playerItems.entries()) {
        newData[index] = item
      }

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

  const onInventoryDigits = useCallback(
    (digit: number, pressed: boolean) => {
      if (!pressed) return
      const idx = digit - 1
      setActiveSlot(idx)
      player.inventory.setItemInHand(data[idx])
    },
    [player, data, setActiveSlot],
  )

  const onItemAdd = useCallback(
    (item: PlayerInventoryItem) => {
      setData(prev => {
        const newData = [...prev]
        const slotIndex = newData.indexOf(undefined)
        if (slotIndex !== -1) {
          newData[slotIndex] = item
          if (slotIndex === activeSlot) {
            player.inventory.setItemInHand(item)
          }
        }

        return newData
      })
    },
    [setData, activeSlot, player.inventory],
  )

  const onItemRemove = useCallback(
    (item: PlayerInventoryItem) => {
      setData(prev => {
        const newData = [...prev]
        const slotIndex = newData.findIndex(slot => slot && slot.id === item.id)
        if (slotIndex !== -1) {
          newData[slotIndex] = undefined
          if (slotIndex === activeSlot) {
            player.inventory.setItemInHand(undefined)
          }
        }

        return newData
      })
    },
    [setData, activeSlot, player.inventory],
  )

  // listen to the events
  useGameEventListener('inputs', '@inventory/open', onInventoryOpen)
  for (let index = 0; index <= 9; index++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGameEventListener('inputs', `@inventory/digit${index}`, (va: boolean) =>
      onInventoryDigits(index, va),
    )
  }

  useGameEventListener('common', 'onInventoryAddItem', onItemAdd)
  useGameEventListener('common', 'onInventoryRemoveItem', onItemRemove)

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

export const initializeGameUI = (game: Game<false>) => {
  // here we register the inputs
  const registerInput = (input: string, key: KeyCode) =>
    game.client?.inputs.registerInput(input, key)

  const digits = Array.from({ length: 9 }, (_, index) => 'digit' + (index + 1))
  const keys: KeyCode[] = [
    'KeyE',
    ...Array.from(
      { length: 9 },
      (_, index) => ('Digit' + (index + 1)) as KeyCode,
    ),
  ]

  for (const [index, input] of ['open', ...digits].entries())
    registerInput(`@inventory/${input}`, keys[index])

  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(
        <GameContext.Provider value={game}>
          <InventoryApp player={entity} />
        </GameContext.Provider>,
      )
    }
  })
}
