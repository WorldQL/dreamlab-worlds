import type { CSSProperties } from "react"

export const styles: { [key: string]: CSSProperties } = {
  pickupOverlay: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
    padding: "8px",
    width: "auto",
    height: "auto"
  },
  itemAddedOverlay: {
    position: "absolute",
    bottom: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(0, 128, 0, 0.75)"
  },
  itemTexture: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "50%",
    marginBottom: "10px"
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  itemName: {
    fontSize: "16px",
    color: "white",
    fontWeight: "bold",
    marginBottom: "5px"
  },
  loreSection: {
    backgroundColor: "rgba(245, 222, 179, 0.9)",
    color: "#654321",
    fontFamily: "'Courier New', Courier, monospace",
    border: "1px solid #8B4513",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    overflowY: "auto",
    textShadow: "1px 1px 2px #DEB887",
    margin: "10px 0",
    textAlign: "justify",
    lineHeight: "1.5",
    maxWidth: "300px",
    fontSize: "12px",
    padding: "10px"
  },
  statsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(128, 64, 0, 0.8)",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)"
  },
  statName: {
    fontSize: "14px",
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: "3px"
  },
  statValue: {
    fontSize: "14px",
    color: "white",
    marginBottom: "3px"
  },
  pickupPrompt: {
    fontSize: "12px",
    color: "white",
    fontStyle: "italic"
  },
  gameScreenLabel: {
    fontSize: "28px",
    marginRight: "10px",
    fontWeight: "bold"
  },
  healthContainer: {
    position: "absolute",
    bottom: "75px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "600px",
    alignItems: "center",
    zIndex: 10
  },
  heartIcon: {
    fontSize: "24px",
    color: "red"
  },
  scoreContainer: {
    display: "flex",
    alignItems: "center"
  },
  score: {
    fontSize: "28px",
    marginRight: "10px",
    fontWeight: "bold"
  },
  zombieIcon: {
    fontSize: "28px"
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 2
  },
  damageOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `radial-gradient(circle at center, transparent, transparent 40%, rgba(255, 0, 0, 0.7) 100%)`,
    transition: "opacity 0.5s ease-in-out",
    opacity: 0,
    pointerEvents: "none"
  },
  gameScreenContainer: {
    position: "absolute",
    top: "10%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    pointerEvents: "none",
    background: "transparent"
  },
  gameScreenTitle: {
    fontSize: "32px",
    color: "white",
    textShadow: "2px 2px 4px black"
  },
  dealthOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 80% 10%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 85% 90%, rgba(255, 0, 0, 0.8), transparent 50%)`
  },
  title: {
    fontSize: "48px",
    color: "white",
    textShadow: "2px 2px 4px black",
    marginBottom: "20px"
  },
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#1a1a1a",
    pointerEvents: "auto",
    zIndex: 15
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1
  },
  button: {
    padding: "10px 25px",
    fontSize: "35px",
    fontWeight: "bold",
    color: "#3a2502",
    backgroundColor: "#c19a6b",
    border: "2px solid #7f462c",
    borderRadius: "0",
    cursor: "pointer",
    textShadow: "1px 1px 0px #fff6dc",
    boxShadow: "3px 3px 0px #7f462c",
    fontFamily: "'Courier New', Courier, monospace",
    transition: "all 0.2s ease-in-out"
  },
  backgroundAnimation: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage:
      'url("https://s3-assets.dreamlab.gg/uploaded-from-editor/background-1702293365691.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center center"
  },
  versionLabel: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    zIndex: 1_000
  }
}
