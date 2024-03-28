import type { FC } from "https://esm.sh/react@18.2.0"
import { useEffect, useState, useCallback } from "https://esm.sh/react@18.2.0"
import { events } from "../events.ts"
import PlayerManager from "../playerManager.ts"
import { DeathScene } from "./scene/deathScene.tsx"
import type { StartSceneProps } from "./scene/playScene.tsx"
import { styles } from "./styles.ts"

export const GameHUD: FC<StartSceneProps> = ({ game, player }) => {
  const playerManager = PlayerManager.getInstance()
  const [playerData, setPlayerData] = useState({
    kills: playerManager.getKills(),
    gold: playerManager.getGold(),
    health: playerManager.getHealth(),
    quests: playerManager.getQuests()
  })
  const [showDamage, setShowDamage] = useState(false)
  const [showQuestCompleted, setShowQuestCompleted] = useState(false)
  const [dashCooldown, setDashCooldown] = useState(0)
  const [dashTimer, setDashTimer] = useState(0)

  const handlePlayerUpdate = useCallback(() => {
    setPlayerData({
      kills: playerManager.getKills(),
      gold: playerManager.getGold(),
      health: playerManager.getHealth(),
      quests: playerManager.getQuests()
    })
  }, [playerManager])

  const handleDamage = useCallback(
    (healthChange: number) => {
      playerManager.removeHealth(healthChange)
      handlePlayerUpdate()
      setShowDamage(true)
      setTimeout(() => setShowDamage(false), 300)
    },
    [playerManager, handlePlayerUpdate]
  )

  const handleHeal = useCallback(
    (healthChange: number) => {
      playerManager.addHealth(healthChange)
      handlePlayerUpdate()
    },
    [playerManager, handlePlayerUpdate]
  )

  const handleQuestCompleted = useCallback(() => {
    setShowQuestCompleted(true)
    setTimeout(() => setShowQuestCompleted(false), 3000)
  }, [])

  useEffect(() => {
    const handleDashCooldownStart = (duration: number) => {
      setDashCooldown(duration)
      setDashTimer(duration)
    }

    const handleDashCooldownEnd = () => {
      setDashCooldown(0)
      setDashTimer(0)
    }

    events.addListener("onDashCooldownStart", handleDashCooldownStart)
    events.addListener("onDashCooldownEnd", handleDashCooldownEnd)
    events.addListener("onPlayerKill", handlePlayerUpdate)
    events.addListener("onPlayerDamage", handleDamage)
    events.addListener("onPlayerHeal", handleHeal)
    events.addListener("onGoldUpdate", handlePlayerUpdate)
    events.addListener("onQuestAccepted", handlePlayerUpdate)
    events.addListener("onQuestCompleted", handleQuestCompleted)

    return () => {
      events.removeListener("onPlayerKill", handlePlayerUpdate)
      events.removeListener("onPlayerDamage", handleDamage)
      events.removeListener("onPlayerHeal", handleHeal)
      events.removeListener("onGoldUpdate", handlePlayerUpdate)
      events.removeListener("onQuestAccepted", handlePlayerUpdate)
      events.removeListener("onQuestCompleted", handleQuestCompleted)
      events.removeListener("onDashCooldownStart", handleDashCooldownStart)
      events.removeListener("onDashCooldownEnd", handleDashCooldownEnd)
    }
  }, [handlePlayerUpdate, handleDamage, handleHeal])

  useEffect(() => {
    let timerId: number | undefined

    if (dashCooldown > 0) {
      timerId = window.setInterval(() => {
        setDashTimer((prevTimer: number) => Math.max(prevTimer - 100, 0))
      }, 100)
    }

    return () => {
      if (timerId) {
        window.clearInterval(timerId)
      }
    }
  }, [dashCooldown])

  const handleStartOver = useCallback(async () => {
    playerManager.setHealth(playerManager.getMaxHealth())
    handlePlayerUpdate()
    player.teleport({ x: 0, y: 500 }, true)
  }, [playerManager, handlePlayerUpdate, player])

  return (
    <>
      {showDamage && <div style={{ ...styles.damageOverlay, opacity: showDamage ? 1 : 0 }} />}
      {showQuestCompleted && (
        <div style={styles.questCompletedOverlay}>
          <h2 style={styles.questCompletedText}>Quest Completed!</h2>
          <p style={styles.questCompletedSubtext}>Yeehaw, partner!</p>
        </div>
      )}
      {playerData.health <= 0 ? (
        <DeathScene game={game} onStartOver={handleStartOver} kills={playerData.kills} />
      ) : (
        <>
          <div style={styles.dashCooldownContainer}>
            <span style={styles.dashCooldownIcon}>⚡</span>
            {dashCooldown > 0 ? (
              <span style={styles.dashCooldownTimer}>{(dashTimer / 1000).toFixed(1)}s</span>
            ) : (
              <span style={styles.dashCooldownReady}>Ready</span>
            )}
          </div>
          <div style={styles.healthContainer}>
            {Array.from({ length: playerManager.getMaxHealth() }).map((_, index) => (
              <span
                key={`heart-${playerManager.getMaxHealth() - index}`}
                style={{
                  ...styles.heartIcon,
                  opacity: index < playerData.health ? 1 : 0.3
                }}
              >
                ❤️
              </span>
            ))}
          </div>
          <div style={styles.gameScreenContainer}>
            <div style={styles.killsContainer}>
              <span style={styles.gameScreenLabel}>Kills:</span>
              <span style={styles.kills}>{playerData.kills}</span>
            </div>
            <div style={styles.killsContainer}>
              <span style={styles.gameScreenLabel}>🪙</span>
              <span style={styles.kills}>{playerData.gold}</span>
            </div>
          </div>
          <div style={styles.questContainer}>
            <h3 style={styles.questTitle}>Quests</h3>
            {playerManager.getQuests().map((quest, index) => (
              <div key={`quest-${index}`} style={styles.quest}>
                <span style={styles.questName}>{quest.title}</span>
                <span style={styles.questStatus}>{quest.completed ? "✔️" : "❌"}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}