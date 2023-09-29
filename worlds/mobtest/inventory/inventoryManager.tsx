import { isPlayer } from '@dreamlab.gg/core/dist/entities'
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
import { InventoryData, InventorySlot } from './types.js'

const App: React.FC<{ game: any; player: any }> = ({ game, player }) => {
  const initialData = [...Array(4)].map(() => Array(9).fill(undefined))
  const [data, setData] = useState<InventoryData>(initialData)
  const [sourceSlot, setSourceSlot] = useState<{
    row: number
    col: number
  } | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)

  useEffect(() => {
    const updateInventoryData = () => {
      const playerItems = player.inventory.getItems()
      const flatData = [...data.flat()]
      playerItems.forEach((item: InventorySlot, index: any) => {
        flatData[index] = item
      })
      const updatedData = []
      while (flatData.length) updatedData.push(flatData.splice(0, 9))
      setData(updatedData)
    }
    updateInventoryData()
  }, [player])

  useEffect(() => {
    const handleDigitInput = () => {
      const weaponSlots = data[data.length - 1].slice(0, 4)
      for (let i = 1; i <= 4; i++) {
        if (
          game.client?.inputs.getInput(`@inventory/digit${i}`) &&
          weaponSlots[i - 1]
        ) {
          player.inventory.setCurrentItem(weaponSlots[i - 1])
        }
      }
      requestAnimationFrame(handleDigitInput)
    }
    handleDigitInput()
  }, [game, player, data])

  useEffect(() => {
    let lastToggleTime = 0
    const toggleDelay = 200
    const checkInputAndOpenInventory = () => {
      const shouldOpenInventory =
        game.client?.inputs?.getInput('@inventory/open') ?? false
      const currentTime = new Date().getTime()
      if (shouldOpenInventory && currentTime - lastToggleTime > toggleDelay) {
        setIsInventoryOpen(prev => !prev)
        lastToggleTime = currentTime
      }
      requestAnimationFrame(checkInputAndOpenInventory)
    }
    checkInputAndOpenInventory()
  }, [game])

  const handleClick = useCallback((row: number, col: number) => {
    handleInventoryClick(row, col)
  }, [])
  const handleDragStart = useCallback((row: number, col: number) => {
    setSourceSlot({ row, col })
    handleInventoryDragStart(row, col)
  }, [])

  const handleDragEnd = useCallback(
    (row: number, col: number) => {
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
      setData(newData)
      setSourceSlot(null)
      handleInventoryDragEnd(row, col)
    },
    [data, sourceSlot],
  )

  return isInventoryOpen ? (
    <Inventory
      data={data}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  ) : null
}

export const initializeGameUI = (game: any) => {
  const registerInput = (input: string, key: string) =>
    game.client?.inputs.registerInput(input, key)
  registerInput('@inventory/open', 'KeyQ')
  registerInput('@inventory/digit1', 'Digit1')
  registerInput('@inventory/digit2', 'Digit2')
  registerInput('@inventory/digit3', 'Digit3')
  registerInput('@inventory/digit4', 'Digit4')

  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(<App game={game} player={entity} />)
    }
  })
}
