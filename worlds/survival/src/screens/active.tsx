import { onlyNetClient } from '@dreamlab.gg/core/dist/network'
import { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { events } from '../events'
import { DeathScreen } from './death'
import type { ScreenProps } from './start'
import { styles } from './styles'

export const GameScreen: React.FC<ScreenProps> = ({ game, player }) => {
  const [killCount, setKillCount] = useState(0)
  const [health, setHealth] = useState(5)
  const [showDamage, setShowDamage] = useState(false)
  const maxHealth = 5

  const PLAY_CHANNEL = 'game/start'
  const netClient = onlyNetClient(game)

  useEffect(() => {
    const killListener = () => {
      setKillCount(prev => prev + 1)
    }

    const healthListener = (healthChange: number, isHealing = false) => {
      setHealth(prev => {
        return isHealing
          ? Math.min(prev + healthChange, 5)
          : Math.max(prev - healthChange, 0)
      })
      setShowDamage(true)
      setTimeout(() => setShowDamage(false), 300)
    }

    const damageListener = (healthChange: number) =>
      healthListener(healthChange)

    const healListener = (healthChange: number) =>
      healthListener(healthChange, true)

    events.addListener('onPlayerKill', killListener)
    events.addListener('onPlayerDamage', damageListener)
    events.addListener('onPlayerHeal', healListener)

    return () => {
      events.removeListener('onPlayerKill', killListener)
      events.removeListener('onPlayerDamage', damageListener)
      events.removeListener('onPlayerHeal', healListener)
    }
  }, [])

  const handleStartOver = async () => {
    setKillCount(0)
    setHealth(5)
    player.teleport({ x: 0, y: 500 }, true)
    netClient?.sendCustomMessage(PLAY_CHANNEL, {})
  }

  return (
    <>
      {showDamage && (
        <div style={{ ...styles.damageOverlay, opacity: showDamage ? 1 : 0 }} />
      )}
      {health <= 0 ? (
        <DeathScreen
          game={game}
          killCount={killCount}
          onStartOver={handleStartOver}
        />
      ) : (
        <div style={styles.gameScreenContainer}>
          <div style={styles.healthContainer}>
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
