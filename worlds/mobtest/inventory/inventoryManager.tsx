import { Player, isPlayer } from '@dreamlab.gg/core/dist/entities'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import Inventory from './Inventory.js'
import { handleInventoryClick } from './events/InventoryClickEvent.js'
import {
  handleInventoryDragStart,
  handleInventoryDragEnd,
} from './events/InventoryDragEvent.js'
import { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'

export type InventoryData = PlayerInventoryItem[]

const InventoryApp: React.FC<{ game: any; player: Player }> = ({
  game,
  player,
}) => {
  const totalSlots = 36
  const initialData = Array(totalSlots).fill(undefined)
  const [data, setData] = useState<InventoryData>(initialData)
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  const [sourceSlot, setSourceSlot] = useState<number | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)

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
          setCurrentSlot(i)
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

  const handleSlotInteraction = useCallback(
    (slotIndex: number, interaction: Function) => {
      interaction(slotIndex)
    },
    [],
  )

  return isInventoryOpen ? (
    <Inventory
      data={data}
      onClick={slotIndex =>
        handleSlotInteraction(slotIndex, handleInventoryClick)
      }
      onDragStart={slotIndex => {
        setSourceSlot(slotIndex)
        handleSlotInteraction(slotIndex, handleInventoryDragStart)
      }}
      onDragEnd={slotIndex => {
        if (sourceSlot === null) return

        if (sourceSlot === slotIndex) {
          setSourceSlot(null)
          return
        }

        const newData = [...data]
        ;[newData[sourceSlot], newData[slotIndex]] = [
          newData[slotIndex],
          newData[sourceSlot],
        ]

        if (currentSlot === sourceSlot) {
          player.inventory.setItemInHand(newData[sourceSlot])
        } else if (currentSlot === slotIndex) {
          player.inventory.setItemInHand(newData[slotIndex])
        }

        setData(newData)
        setSourceSlot(null)
        handleSlotInteraction(slotIndex, handleInventoryDragEnd)
      }}
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
