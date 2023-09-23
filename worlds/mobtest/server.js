import { sharedInit } from './shared.js'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        game.spawn({
          entity: 'testBall',
          // Give the ball a random radius between 20 and 150.
          // This is the "radius" positional argument on createTestBall
          args: [randInt(20, 150)],
          // Spawn the ball at a random x coordinate between -600 and 600
          transform: { position: [randInt(-600, 600), -700] },
          // Give the ball a "net/replicated" tag to automatically sync it between clients 
          tags: ['net/replicated'],
        })
      }, i * 1000);
    }
  }, 10000)
 
}
