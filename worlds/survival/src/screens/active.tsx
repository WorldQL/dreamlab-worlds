import { onlyNetClient } from '@dreamlab.gg/core/dist/network'
import { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events'
import { GameOver } from './end'
import type { ScreenProps } from './start'
import { styles } from './styles'

export const GameScreen: React.FC<ScreenProps> = ({ game, player }) => {
  const [killCount, setKillCount] = useState(0)
  const [health, setHealth] = useState(5)
  const maxHealth = 5

  const PLAY_CHANNEL = 'game/start'
  const netClient = onlyNetClient(game)

  useEffect(() => {
    const killListener = () => {
      setKillCount(prev => prev + 1)
    }

    const healthListener = () => {
      setHealth(prev => prev - 1)
    }

    events.addListener('onPlayerKill', killListener)
    events.addListener('onPlayerDamage', healthListener)

    return () => {
      events.removeListener('onPlayerKill', killListener)
      events.removeListener('onPlayerDamage', healthListener)
    }
  }, [])

  const handleStartOver = async () => {
    setKillCount(0)
    setHealth(5)
    player.teleport({ x: 0, y: 300 }, true)
    netClient?.sendCustomMessage(PLAY_CHANNEL, {})
  }

  return (
    <>
      {health <= 0 ? (
        <GameOver
          game={game}
          killCount={killCount}
          onStartOver={handleStartOver}
        />
      ) : (
        <div style={styles.gameScreenContainer}>
          <div style={styles.healthContainer}>
            <span style={styles.gameScreenLabel}>Health:</span>
            {Array.from({ length: maxHealth }).map((_, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                style={{
                  ...styles.heartIcon,
                  opacity: index < health ? 1 : 0.3,
                }}
              >
                ❤️
              </span>
            ))}
          </div>
          <div style={styles.killContainer}>
            <span style={styles.gameScreenLabel}>Kills:</span>
            <span style={styles.killCount}>{killCount}</span>
            <span style={styles.zombieIcon}>🧟</span>
          </div>
        </div>
      )}
    </>
  )
}
