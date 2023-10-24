import { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import type { ScreenProps } from './start'
import { styles } from './styles'

export const GameScreen: React.FC<ScreenProps> = ({ game }) => {
  const [killCount, setKillCount] = useState(0)

  useEffect(() => {
    const killListener = () => {
      console.log(`Killed a zombie!`)
      setKillCount(prev => prev + 1)
    }

    game.events.custom.addListener('onPlayerKill', killListener)

    return () => {
      game.events.custom.removeListener('onPlayerKill', killListener)
    }
  }, [game])

  return (
    <div style={styles.gameScreenContainer}>
      <div style={styles.gameScreenTitle}>Kills: {killCount}</div>
    </div>
  )
}
