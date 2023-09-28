import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import Inventory from './inventory/Inventory.js'
import { handleInventoryClick } from './inventory/InventoryClickEvent.js'
import {
  handleInventoryDragStart,
  handleInventoryDragEnd,
} from './inventory/InventoryDragEvent.js'
import { InventoryData, InventorySlot } from './inventory/types.js'

const App: React.FC<{ game: any; player: any }> = ({ game, player }) => {
  const [data, setData] = useState<InventoryData>(
    [...Array(4)].map(() => Array(9).fill(undefined)),
  )
  const [sourceSlot, setSourceSlot] = useState<{
    row: number
    col: number
  } | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)

  useEffect(() => {
    const playerItems = player.inventory.getItems()
    const flatData = [...data.flat()]
    playerItems.forEach((item: InventorySlot, index: any) => {
      flatData[index] = item
    })

    const updatedData = []
    while (flatData.length) updatedData.push(flatData.splice(0, 9))
    setData(updatedData)
  }, [player])

  useEffect(() => {
    const handleDigitInput = () => {
      const weaponSlots = data[data.length - 1].slice(0, 4)

      if (game.client?.inputs.getInput('@inventory/digit1') && weaponSlots[0]) {
        player.inventory.setCurrentItem(weaponSlots[0])
      }
      if (game.client?.inputs.getInput('@inventory/digit2') && weaponSlots[1]) {
        player.inventory.setCurrentItem(weaponSlots[1])
      }
      if (game.client?.inputs.getInput('@inventory/digit3') && weaponSlots[2]) {
        player.inventory.setCurrentItem(weaponSlots[2])
      }
      if (game.client?.inputs.getInput('@inventory/digit4') && weaponSlots[3]) {
        player.inventory.setCurrentItem(weaponSlots[3])
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
      if (sourceSlot) {
        if (sourceSlot.row === row && sourceSlot.col === col) {
          setSourceSlot(null)
          return
        }

        const newData = [...data]
        const draggedItem = newData[sourceSlot.row][sourceSlot.col]
        const targetItem = newData[row][col]

        newData[sourceSlot.row][sourceSlot.col] = targetItem
        newData[row][col] = draggedItem

        setData(newData)
        setSourceSlot(null)
      }
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
  game.client?.inputs.registerInput('@inventory/open', 'KeyQ')
  game.client?.inputs.registerInput('@inventory/digit1', 'Digit1')
  game.client?.inputs.registerInput('@inventory/digit2', 'Digit2')
  game.client?.inputs.registerInput('@inventory/digit3', 'Digit3')
  game.client?.inputs.registerInput('@inventory/digit4', 'Digit4')

  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(<App game={game} player={entity} />)
    }
  })
}
