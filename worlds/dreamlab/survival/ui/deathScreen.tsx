import type { Game } from "@dreamlab.gg/core";
import type { CSSProperties, FC } from "https://esm.sh/react@18.2.0";
import { useState } from "https://esm.sh/react@18.2.0";
import { styles } from "./styles.ts";

interface DeathScreenProps {
  game: Game<false>;
  score: number;
  onStartOver(): void;
}

export const DeathScreen: FC<DeathScreenProps> = ({ score, onStartOver }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const getButtonStyles = (): CSSProperties => {
    const style: CSSProperties = { ...styles.button };

    if (active) {
      style.transform = "scale(0.95)";
    }

    if (hovered) {
      style.transform = "scale(1.1)";
      style.boxShadow = "0 0 15px #9d9d9d";
    }

    return style;
  };

  return (
    <div style={styles.container}>
      <div style={styles.dealthOverlay} />
      <div style={styles.content}>
        <div style={styles.title}>You Died</div>
        <div style={{ ...styles.scoreContainer, marginBottom: "20px" }}>
          <span style={styles.gameScreenLabel}>Score:</span>
          <span style={styles.score}>{score}</span>
        </div>
        <button
          onClick={onStartOver}
          onMouseDown={() => setActive(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setActive(false);
          }}
          onMouseUp={() => setActive(false)}
          style={getButtonStyles()}
          type="button"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
