import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { usePlayer } from '@dreamlab.gg/ui/dist/react'
import type { FC } from 'https://esm.sh/react@18.2.0'
import { useEffect, useRef, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events'
import type { InventoryItem } from '../inventory/inventoryManager'
import InventoryManager from '../inventory/inventoryManager'
import PlayerManager from '../managers/playerData'
import { styles } from './styles'

interface ItemPopupProps {
  game: Game<false>
  item: InventoryItem | undefined
}

export const ItemScreen: FC<ItemPopupProps> = ({ game, item }) => {
  const player = usePlayer()
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [currentItem, setCurrentItem] = useState<InventoryItem | undefined>(
    item,
  )
  const itemRef = useRef<InventoryItem | undefined>(item)
  const playerManager = PlayerManager.getInstance()
  const inventoryManager = InventoryManager.getInstance()

  useEffect(() => {
    const itemListener = (
      _player: Player,
      newItem: InventoryItem | undefined,
    ) => {
      itemRef.current = newItem
      setCurrentItem(newItem)
      setPurchaseComplete(false)
      setAwaitingConfirmation(false)
      setPrompt(
        `Press F to buy ${newItem?.baseGear?.displayName} for ${newItem?.value}🪙`,
      )
    }

    const itemConfirmListener = (keyDown: boolean) => {
      if (!keyDown) {
        // ignore if key up, only respond to key down
        return
      }

      const itemToPickup = itemRef.current
      if (itemToPickup) {
        if (
          itemToPickup.value &&
          itemToPickup.value > 0 &&
          !awaitingConfirmation &&
          !purchaseComplete
        ) {
          setPrompt(
            `Confirm purchase of ${itemToPickup.baseGear?.displayName} for ${itemToPickup.value}🪙? Press F again to confirm.`,
          )
          setAwaitingConfirmation(true)
        } else if (
          itemToPickup.value &&
          itemToPickup.value > 0 &&
          awaitingConfirmation &&
          !purchaseComplete
        ) {
          setPurchaseComplete(true)
          if (playerManager.getGold() >= itemToPickup.value) {
            playerManager.removeGold(itemToPickup.value)
            inventoryManager.addItemToInventory(itemToPickup)
            setPrompt('Item Purchased!')
          } else {
            setPrompt('Not enough 🪙.')
          }

          setAwaitingConfirmation(false)
        } else {
          if (!purchaseComplete)
            inventoryManager.addItemToInventory(itemToPickup)
          setPrompt('Item Purchased!')
        }
      }
    }

    events.addListener('onPlayerNearItem', itemListener)
    game.client.inputs.addListener('@survival/pickup', itemConfirmListener)

    return () => {
      events.removeListener('onPlayerNearItem', itemListener)
      game.client.inputs.removeListener('@survival/pickup', itemConfirmListener)
    }
  }, [
    game.client.inputs,
    player,
    playerManager,
    inventoryManager,
    awaitingConfirmation,
    purchaseComplete,
  ])

  if (!currentItem) return null
  const overlayStyle = styles.pickupOverlay
  const promptMessage = prompt

  return (
    <div style={overlayStyle}>
      <div style={styles.itemInfo}>
        <span style={styles.itemName}>{currentItem.baseGear?.displayName}</span>
        <div style={styles.statsSection}>
          <span style={styles.statName}>Stats:</span>
          <span style={styles.statValue}>Damage: {currentItem.damage}</span>
          {currentItem.projectileType && (
            <span style={styles.statValue}>
              Barrel: {currentItem.projectileType}
            </span>
          )}
        </div>
        <span style={styles.loreSection}>{currentItem.lore}</span>
        <span style={styles.pickupPrompt}>{promptMessage}</span>
      </div>
    </div>
  )
}
