import { Texture, Sprite, Application } from 'pixi.js'

export const textureToImage = async (
  texture: Texture | null | undefined,
): Promise<HTMLImageElement | null> => {
  if (!texture) {
    console.error('Invalid texture:', texture)
    return null
  }

  const app = new Application({
    width: texture.width,
    height: texture.height,
    backgroundAlpha: 0,
  })

  const sprite = new Sprite(texture)

  app.stage.addChild(sprite)
  sprite.position.set(0, 0)
  sprite.width = texture.width
  sprite.height = texture.height

  app.render()

  const image = new Image()

  try {
    const dataUrl = await app.renderer.extract.base64(sprite)

    image.src = dataUrl

    image.height = 200
    image.width = 200

    app.destroy()

    console.log(image)
    return image
  } catch (error) {
    console.error('Error extracting image:', error)
    app.destroy()
    return null
  }
}
