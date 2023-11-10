import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
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

  const handlePlayClick = async () => {
    setGameStarted(true)
  }

  const getButtonStyles = (hover: boolean, active: boolean): CSSProperties => {
    const style: CSSProperties = { ...styles.button }
    if (active) {
      style.transform = 'translateY(2px)'
      style.boxShadow = '1px 1px 0px #7f462c'
    }

    if (hover) {
      style.backgroundColor = '#a52a2a'
      style.color = '#ffffff'
      style.borderColor = '#7f0000'
      style.boxShadow = '0 0 10px 3px #ff0000'
      style.textShadow = '0 0 5px #ff0000, 0 0 10px #ff0000'
    }

    return style
  }

  if (gameStarted) {
    return <GameScreen game={game} player={player} />
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundAnimation} />
      <div style={styles.content}>
        <button
          onClick={handlePlayClick}
          onMouseDown={() => setActive(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false)
            setActive(false)
          }}
          onMouseUp={() => setActive(false)}
          style={{
            ...getButtonStyles(hovered, active),
          }}
          type='button'
        >
          Play
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
