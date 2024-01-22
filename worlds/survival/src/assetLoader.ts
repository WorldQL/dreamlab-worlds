import { loadPlayerSpritesheet } from '@dreamlab.gg/core/dist/textures'
import type { Texture } from 'pixi.js'

interface PreloadedAssets {
  walkTextures: Texture[]
  recoilTextures: Texture[]
  punchTextures: Texture[]
}

let preloadPromise: Promise<PreloadedAssets> | null = null
let preloadedAssets: PreloadedAssets | null = null

export async function preloadAssets(): Promise<PreloadedAssets> {
  if (preloadedAssets) {
    return preloadedAssets
  }

  if (!preloadPromise) {
    preloadPromise = (async () => {
      const spritesheetWalk = await loadPlayerSpritesheet(
        '/animations/z1walk.json',
      )
      const spritesheetRecoil = await loadPlayerSpritesheet(
        '/animations/z1hitreact.json',
      )
      const spritesheetPunch = await loadPlayerSpritesheet(
        '/animations/z1punch.json',
      )

      preloadedAssets = {
        walkTextures: spritesheetWalk.textures,
        recoilTextures: spritesheetRecoil.textures,
        punchTextures: spritesheetPunch.textures,
      }

      return preloadedAssets
    })()
  }

  return preloadPromise
}

export function getPreloadedAssets(): PreloadedAssets {
  if (!preloadedAssets) {
    throw new Error('Assets have not been preloaded yet')
  }

  return preloadedAssets
}
