import { loadPlayerSpritesheet } from '@dreamlab.gg/core/dist/textures'
import type { Texture } from 'pixi.js'

interface PreloadedAssets {
  walkTextures: Texture[]
  recoilTextures: Texture[]
}

let preloadedAssets: PreloadedAssets | null = null

export async function preloadAssets(): Promise<PreloadedAssets> {
  if (preloadedAssets) return preloadedAssets

  const spritesheetWalk = await loadPlayerSpritesheet('/animations/z1walk.json')
  const spritesheetRecoil = await loadPlayerSpritesheet(
    '/animations/z1hitreact.json',
  )

  preloadedAssets = {
    walkTextures: spritesheetWalk.textures,
    recoilTextures: spritesheetRecoil.textures,
  }

  return preloadedAssets
}

export function getPreloadedAssets(): PreloadedAssets {
  if (!preloadedAssets) {
    throw new Error('Assets have not been preloaded yet')
  }

  return preloadedAssets
}
