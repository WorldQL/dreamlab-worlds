import type { FC } from "https://esm.sh/react@18.2.0";
import { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { events } from "../events.ts";
import PlayerManager from "../playerDataManager.ts";
import { DeathScreen } from "./deathScreen.tsx";
import type { StartScreenProps } from "./startScreen.tsx";
import { styles } from "./styles.ts";

export const GameScreen: FC<StartScreenProps> = ({ game, player }) => {
  const playerManager = PlayerManager.getInstance();
  const [score, setScore] = useState(playerManager.getScore());
  const [gold, setGold] = useState(playerManager.getGold());
  const [health, setHealth] = useState(playerManager.getHealth());
  const [showDamage, setShowDamage] = useState(false);

  useEffect(() => {
    const scoreListener = (newScore: number) => {
      playerManager.addScore(newScore);
      setScore(playerManager.getScore());

      const goldToAdd = Math.floor(Math.random() * (newScore / 2));
      playerManager.addGold(goldToAdd);
      setGold(playerManager.getGold());
    };

    const goldListener = () => {
      setGold(playerManager.getGold());
    };

    const healthListener = (healthChange: number, isHealing = false) => {
      if (isHealing) playerManager.addHealth(healthChange);
      else playerManager.removeHealth(healthChange);
      setHealth(playerManager.getHealth());
      setShowDamage(true);
      setTimeout(() => setShowDamage(false), 300);
    };

    const damageListener = (healthChange: number) =>
      healthListener(healthChange);

    const healListener = (healthChange: number) =>
      healthListener(healthChange, true);

    events.addListener("onPlayerScore", scoreListener);
    events.addListener("onPlayerDamage", damageListener);
    events.addListener("onPlayerHeal", healListener);
    events.addListener("onGoldUpdate", goldListener);

    return () => {
      events.removeListener("onPlayerScore", scoreListener);
      events.removeListener("onPlayerDamage", damageListener);
      events.removeListener("onPlayerHeal", healListener);
      events.removeListener("onGoldUpdate", goldListener);
    };
  }, [playerManager]);

  const handleStartOver = async () => {
    playerManager.setHealth(playerManager.getMaxHealth());

    setHealth(playerManager.getHealth());
    player.teleport({ x: 0, y: 500 }, true);
  };

  return (
    <>
      {showDamage && (
        <div style={{ ...styles.damageOverlay, opacity: showDamage ? 1 : 0 }} />
      )}
      {health <= 0 ? (
        <DeathScreen game={game} onStartOver={handleStartOver} score={score} />
      ) : (
        <>
          <div style={styles.healthContainer}>
            {Array.from({ length: playerManager.getMaxHealth() }).map(
              (_, index) => (
                <span
                  key={`heart-${playerManager.getMaxHealth() - index}`}
                  style={{
                    ...styles.heartIcon,
                    opacity: index < health ? 1 : 0.3,
                  }}
                >
                  ❤️
                </span>
              )
            )}
          </div>
          <div style={styles.gameScreenContainer}>
            <div style={styles.scoreContainer}>
              <span style={styles.gameScreenLabel}>Score:</span>
              <span style={styles.score}>{score}</span>
            </div>
            <div style={styles.scoreContainer}>
              <span style={styles.gameScreenLabel}>🪙</span>
              <span style={styles.score}>{gold}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};
