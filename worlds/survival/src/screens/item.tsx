import type { Game } from '@dreamlab.gg/core'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import React, { useEffect, useRef, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events'
import type { InventoryItem } from '../inventory/inventoryManager'
import { styles } from './styles'

interface ItemScreenProps {
  game: Game<false>
  player: Player
  item: InventoryItem | undefined
}

export const ItemScreen: React.FC<ItemScreenProps> = ({
  game,
  player,
  item,
}) => {
  const [keyPressed, setKeyPressed] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | undefined>(
    item,
  )
  const itemRef = useRef<InventoryItem | undefined>(item)

  game.client?.inputs.registerInput('@survival/pickup', 'KeyF')

  useEffect(() => {
    const itemConfirmListener = () => {
      if (!keyPressed && itemRef.current) {
        setKeyPressed(true)
        events.emit('onInventoryAdd', itemRef.current)
      }
    }

    const itemListener = (_player: Player, item: InventoryItem | undefined) => {
      itemRef.current = item
      setCurrentItem(item)
      setKeyPressed(false)
    }

    events.addListener('onPlayerNearItem', itemListener)
    game.client.inputs.addListener('@survival/pickup', itemConfirmListener)

    return () => {
      game.client.inputs.removeListener('@survival/pickup', itemConfirmListener)
    }
  }, [game.client.inputs, keyPressed, player])

  if (!currentItem) return null
  const overlayStyle = keyPressed
    ? styles.itemAddedOverlay
    : styles.pickupOverlay
  const promptMessage = keyPressed ? 'Item Added!' : 'Press F to pickup'

  return (
    <div style={overlayStyle}>
      <img
        alt={currentItem.baseItem?.displayName}
        src={currentItem.baseItem?.textureURL}
        style={styles.itemTexture}
      />
      <div style={styles.itemInfo}>
        <span style={styles.itemName}>{currentItem.baseItem?.displayName}</span>
        <span style={styles.pickupPrompt}>{promptMessage}</span>
      </div>
    </div>
  )
}

export const initializeItemScreen = (game: Game<false>) => {
  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      const root = createRoot(uiContainer)
      root.render(<ItemScreen game={game} item={undefined} player={entity} />)
    }
  })
}
