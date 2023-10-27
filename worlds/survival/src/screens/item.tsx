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
  const [currentItem, setCurrentItem] = useState<
    PlayerInventoryItem | undefined
  >(item)
  const itemRef = useRef<PlayerInventoryItem | undefined>(item)
  const keyFPressed = useRef(false)

  game.client?.inputs.registerInput('@survival/pickup', 'KeyF')

  useEffect(() => {
    const itemConfirmListener = () => {
      if (!keyFPressed.current && itemRef.current) {
        console.log('emitted')
        keyFPressed.current = true
        const inventory = player.inventory
        inventory.addItem(itemRef.current)
      }
    }

    const keyDownListener = (event: KeyboardEvent) => {
      if (event.code === 'KeyF' && !keyFPressed.current) {
        itemConfirmListener()
      }
    }

    const keyUpListener = (event: KeyboardEvent) => {
      if (event.code === 'KeyF') {
        keyFPressed.current = false
      }
    }

    const itemListener = (
      _player: Player,
      item: PlayerInventoryItem | undefined,
    ) => {
      itemRef.current = item
      setCurrentItem(item)
    }

    events.addListener('onPlayerNearItem', itemListener)
    document.addEventListener('keydown', keyDownListener)
    document.addEventListener('keyup', keyUpListener)

    return () => {
      events.removeListener('onPlayerNearItem', itemListener)
      document.removeEventListener('keydown', keyDownListener)
      document.removeEventListener('keyup', keyUpListener)
    }
  }, [game.client.inputs, player])

  if (!currentItem) return null

  return (
    <div style={styles.pickupOverlay}>
      <img
        alt={currentItem.displayName}
        src={currentItem.textureURL}
        style={styles.itemTexture}
      />
      <div style={styles.itemInfo}>
        <span style={styles.itemName}>{currentItem.displayName}</span>
        <span style={styles.pickupPrompt}>Press F to pickup</span>
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
