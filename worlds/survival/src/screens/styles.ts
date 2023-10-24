import type { CSSProperties } from 'https://esm.sh/react@18.2.0'

export const styles: { [key: string]: CSSProperties } = {
  gameScreenContainer: {
    position: 'absolute',
    top: '10%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
