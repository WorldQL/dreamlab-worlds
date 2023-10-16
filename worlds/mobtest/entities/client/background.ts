import { createSpawnableEntity } from "@dreamlab.gg/core";
import { createSprite } from "@dreamlab.gg/core/textures";
import { cloneTransform, Vec } from "@dreamlab.gg/core/math";
import { drawBox } from "@dreamlab.gg/core/utils";
import { Container, Graphics } from "pixi.js";

export const createBackground = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    textureURL: string,
    parallaxX: number,
    parallaxY: number,
  ) => {
    const { position } = transform;

    return {
      get position() {
        return Vec.create(position.x, position.y);
      },

      get tags() {
        return tags;
      },

      get transform() {
        return cloneTransform(transform);
      },

      isInBounds() {
        return false;
      },

      init({ game }) {
        return { game };
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container();
        container.sortableChildren = true;
        container.zIndex = zIndex;
        const graphics = new Graphics();
        graphics.zIndex = zIndex;
        const sprite = createSprite(textureURL, {
          width: width,
          height: height,
          zIndex,
        });

        if (sprite) {
          container.addChild(sprite);
        } else {
          drawBox(graphics, { width, height }, { stroke: "#00f" });
          container.addChild(graphics);
        }

        stage.addChild(container);
        return {
          camera,
          container,
          graphics,
          sprite,
        };
      },

      teardown() {},

      teardownRenderContext({ container }) {
        container.destroy({ children: true });
      },

      onPhysicsStep() {},

      onRenderFrame(_, { game }, { camera, container, graphics }) {
        const debug = game.debug;
        if (!game.client) {
          throw new Error("game.client is undefined");
        }

        const DEFAULT_SCALE = 1;
        const targetW = game.client?.render.container.clientWidth;
        const targetH = game.client?.render.container.clientHeight;

        const zoomScale = camera.zoomScale;
        const cameraOffset = camera.offset;

        const offsetXAtDefaultZoom =
          targetW / DEFAULT_SCALE / 2 - cameraOffset.x;
        const offsetXAtCurrentZoom = targetW / zoomScale / 2 - cameraOffset.x;
        const offsetXDifference = offsetXAtCurrentZoom - offsetXAtDefaultZoom;

        const offsetYAtDefaultZoom =
          targetH / DEFAULT_SCALE / 2 - cameraOffset.y;
        const offsetYAtCurrentZoom = targetH / zoomScale / 2 - cameraOffset.y;
        const offsetYDifference = offsetYAtCurrentZoom - offsetYAtDefaultZoom;

        const parallaxPos = Vec.create(
          position.x +
            cameraOffset.x * parallaxX +
            offsetXDifference * (1 - parallaxX),
          position.y +
            cameraOffset.y * parallaxY +
            offsetYDifference * (1 - parallaxY),
        );
        const scalingFactor = Math.max(2, 0.25);
        container.scale.set(scalingFactor, scalingFactor);

        container.position = parallaxPos;

        const alpha = debug.value ? 0.5 : 0;
        graphics.alpha = alpha;
      },
    };
  },
);
