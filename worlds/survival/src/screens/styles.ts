import type { CSSProperties } from 'https://esm.sh/react@18.2.0'

export const styles: { [key: string]: CSSProperties } = {
  pickupOverlay: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
  },
  itemAddedOverlay: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(0, 128, 0, 0.75)',
  },
  itemTexture: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemName: {
    fontSize: '18px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  pickupPrompt: {
    fontSize: '14px',
    color: 'white',
    fontStyle: 'italic',
  },
  gameScreenLabel: {
    fontSize: '28px',
    marginRight: '10px',
    fontWeight: 'bold',
  },
  healthContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  heartIcon: {
    fontSize: '28px',
    marginLeft: '5px',
  },
  killContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  killCount: {
    fontSize: '28px',
    marginRight: '10px',
    fontWeight: 'bold',
  },
  zombieIcon: {
    fontSize: '28px',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  gameScreenContainer: {
    position: 'absolute',
    top: '5%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    pointerEvents: 'none',
    background: 'transparent',
  },

  gameScreenTitle: {
    fontSize: '32px',
    color: 'white',
    textShadow: '2px 2px 4px black',
  },
  bloodStain: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 80% 10%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.8), transparent 50%),
        radial-gradient(circle at 85% 90%, rgba(255, 0, 0, 0.8), transparent 50%)`,
  },
  title: {
    fontSize: '48px',
    color: 'white',
    textShadow: '2px 2px 4px black',
    marginBottom: '20px',
  },
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#1a1a1a',
    pointerEvents: 'auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    padding: '15px 30px',
    fontSize: '24px',
    background: '#ff0000',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    textShadow: '2px 2px 2px black',
    boxShadow: '0 0 10px #9d9d9d',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
}
