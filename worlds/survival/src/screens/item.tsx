import type { Game } from '@dreamlab.gg/core'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import React, { useEffect, useRef, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events'
import { styles } from './styles'

interface ItemScreenProps {
  game: Game<false>
  player: Player
  item: PlayerInventoryItem | undefined
}

export const ItemScreen: React.FC<ItemScreenProps> = ({
  game,
  player,
  item,
}) => {
  const [keyPressed, setKeyPressed] = useState(false)
  const [currentItem, setCurrentItem] = useState<
    PlayerInventoryItem | undefined
  >(item)
  const itemRef = useRef<PlayerInventoryItem | undefined>(item)

  game.client?.inputs.registerInput('@survival/pickup', 'KeyF')

  useEffect(() => {
    const itemConfirmListener = () => {
      if (!keyPressed && itemRef.current) {
        setKeyPressed(true)
        const inventory = player.inventory
        inventory.addItem(itemRef.current)
      }
    }

    const itemListener = (
      _player: Player,
      item: PlayerInventoryItem | undefined,
    ) => {
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
        alt={currentItem.displayName}
        src={currentItem.textureURL}
        style={styles.itemTexture}
      />
      <div style={styles.itemInfo}>
        <span style={styles.itemName}>{currentItem.displayName}</span>
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
