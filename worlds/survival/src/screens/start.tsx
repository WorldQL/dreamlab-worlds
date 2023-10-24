import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import { onlyNetClient } from '@dreamlab.gg/core/dist/network'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import type { CSSProperties } from 'https://esm.sh/react@18.2.0'
import React, { useState } from 'https://esm.sh/react@18.2.0'
import { GameScreen } from './active'
import { styles } from './styles'

export interface ScreenProps {
  game: Game<false>
  player: Player
}

const StartScreen: React.FC<ScreenProps> = ({ game, player }) => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const PLAY_CHANNEL = 'game/start'
  const netClient = onlyNetClient(game)

  const handlePlayClick = async () => {
    setGameStarted(true)
    netClient?.sendCustomMessage(PLAY_CHANNEL, {})
  }

  const getButtonStyles = (): CSSProperties => {
    const style: CSSProperties = { ...styles.button }

    if (active) {
      style.transform = 'scale(0.95)'
    }

    if (hovered) {
      style.transform = 'scale(1.1)'
      style.boxShadow = '0 0 15px #9d9d9d'
    }

    return style
  }

  if (gameStarted) {
    return <GameScreen game={game} player={player} />
  }

  return (
    <div style={styles.container}>
      <div style={styles.bloodStain} />
      <div style={styles.content}>
        <div style={styles.title}>Zombie Survival</div>
        <button
          onClick={handlePlayClick}
          onMouseDown={() => setActive(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false)
            setActive(false)
          }}
          onMouseUp={() => setActive(false)}
          style={getButtonStyles()}
          type='button'
        >
          PLAY
        </button>
      </div>
    </div>
  )
}

export const initializeStartScreen = (game: Game<false>) => {
  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(
        <StartScreen game={game} player={entity} />,
      )
    }
  })
}
