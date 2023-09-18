import { init as initReactClient } from './dist/client.js';
import { sharedInit } from './shared.js';

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  await sharedInit(game);
  await initReactClient(game);
};
