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

export type InventoryData = PlayerInventoryItem[][]

const InventoryApp: React.FC<{ game: any; player: Player }> = ({
  game,
  player,
}) => {
  const initialData = Array.from({ length: 4 }, () => Array(9).fill(undefined))
  const [data, setData] = useState<InventoryData>(initialData)
  const [sourceSlot, setSourceSlot] = useState<{
    row: number
    col: number
  } | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)

  // fill local inventory with player.inventory
  useEffect(() => {
    const playerItems = player.inventory.getItems()
    const flatData = data.flat()
    playerItems.forEach((item: PlayerInventoryItem, index: any) => {
      flatData[index] = item
    })
    setData(chunkArray(flatData, 9))
  }, [player])

  // handles switching current item in hand
  useEffect(() => {
    const handleDigitInput = () => {
      const weaponSlots = data[0].slice(0, 9)
      Array.from({ length: 9 }, (_, i) => {
        if (
          game.client?.inputs.getInput(`@inventory/digit${i + 1}`) &&
          weaponSlots[i]
        ) {
          player.inventory.setCurrentItem(weaponSlots[i])
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
    (row: number, col: number, interaction: Function) => {
      interaction(row, col)
    },
    [],
  )

  return isInventoryOpen ? (
    <Inventory
      data={data}
      onClick={(row, col) =>
        handleSlotInteraction(row, col, handleInventoryClick)
      }
      onDragStart={(row, col) => {
        setSourceSlot({ row, col })
        handleSlotInteraction(row, col, handleInventoryDragStart)
      }}
      onDragEnd={(row, col) => {
        if (!sourceSlot) return
        const { row: sourceRow, col: sourceCol } = sourceSlot
        if (sourceRow === row && sourceCol === col) {
          setSourceSlot(null)
          return
        }
        const newData = [...data]
        ;[newData[sourceRow][sourceCol], newData[row][col]] = [
          newData[row][col],
          newData[sourceRow][sourceCol],
        ]

        if (player.inventory.currentItem() === newData[sourceRow][sourceCol]) {
          player.inventory.setCurrentItem(newData[row][col])
        }

        setData(newData)
        setSourceSlot(null)
        handleSlotInteraction(row, col, handleInventoryDragEnd)
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

/**
 * This utility function is used to restructure the inventory data from a flat array
 * into a nested array, where each sub-array represents a row in the inventory grid.
 * The specified `size` parameter determines the number of columns in each row.
 *
 * @param array - The original flat array representing the inventory items.
 * @param size - The number of columns in the inventory grid, which is also the length of each sub-array.
 * @returns A nested array where each sub-array represents a row of items in the inventory grid.
 */
const chunkArray = (array: any[], size: number) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
