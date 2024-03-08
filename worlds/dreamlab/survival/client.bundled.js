// runtime/worlds/dreamlab/survival/client.ts
import { deferUntilPlayer } from "@dreamlab.gg/core/dist/utils";

// runtime/worlds/dreamlab/survival/assetLoader.ts
import { resolve } from "@dreamlab.gg/core/dist/sdk";
import { loadPlayerSpritesheet } from "@dreamlab.gg/core/dist/textures";
var preloadPromise = null;
var preloadedAssets = null;
async function preloadAssets() {
  if (preloadedAssets) {
    return preloadedAssets;
  }
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const spritesheetWalk = await loadPlayerSpritesheet(
        resolve("world://animations/z1walk.json")
      );
      const spritesheetRecoil = await loadPlayerSpritesheet(
        resolve("world://animations/z1hitreact.json")
      );
      const spritesheetPunch = await loadPlayerSpritesheet(
        resolve("world://animations/z1punch.json")
      );
      preloadedAssets = {
        walkTextures: spritesheetWalk.textures,
        recoilTextures: spritesheetRecoil.textures,
        punchTextures: spritesheetPunch.textures
      };
      return preloadedAssets;
    })();
  }
  return preloadPromise;
}
function getPreloadedAssets() {
  if (!preloadedAssets) {
    throw new Error("Assets have not been preloaded yet");
  }
  return preloadedAssets;
}

// runtime/worlds/dreamlab/survival/entities/particleSpawner.ts
import { Entity } from "@dreamlab.gg/core";
import {
  game,
  events as magicEvents,
  physics
} from "@dreamlab.gg/core/dist/labs";
import { onlyNetClient } from "@dreamlab.gg/core/dist/network";
import Matter from "matter-js";

// runtime/worlds/dreamlab/survival/events.ts
import { EventEmitter } from "@dreamlab.gg/core/events";
var events = new EventEmitter();

// runtime/worlds/dreamlab/survival/inventory/inventoryManager.ts
var TOTAL_SLOTS = 36;
var InventoryManager = class _InventoryManager {
  static instance;
  inventoryData;
  constructor() {
    this.inventoryData = Array.from({ length: TOTAL_SLOTS }).fill(
      void 0
    );
  }
  static getInstance() {
    if (!_InventoryManager.instance) {
      _InventoryManager.instance = new _InventoryManager();
    }
    return _InventoryManager.instance;
  }
  getInventoryData() {
    return this.inventoryData;
  }
  setInventoryData(data) {
    this.inventoryData = data;
    events.emit("onInventoryUpdate");
  }
  addItemToInventory(newItem) {
    const slotIndex = this.inventoryData.indexOf(void 0);
    if (slotIndex !== -1) {
      this.inventoryData[slotIndex] = newItem;
      events.emit("onInventoryUpdate");
    } else {
      console.warn("No empty slot available to add the item.");
    }
  }
  swapItems(sourceSlotIndex, targetSlotIndex) {
    const temp = this.inventoryData[sourceSlotIndex];
    this.inventoryData[sourceSlotIndex] = this.inventoryData[targetSlotIndex];
    this.inventoryData[targetSlotIndex] = temp;
    events.emit("onInventoryUpdate");
  }
  getInventoryItemFromBaseGear(baseGear) {
    for (const item of this.inventoryData) {
      if (item?.baseGear === baseGear)
        return item;
    }
    return void 0;
  }
};
var inventoryManager_default = InventoryManager;

// runtime/worlds/dreamlab/survival/entities/particleSpawner.ts
var ATTACK_COOLDOWN = 250;
var ParticleSpawner = class extends Entity {
  lastSpawnedTime = null;
  attackPosition = void 0;
  direction = 0;
  bulletDefinition = (rotation) => {
    return {
      entity: "@dreamlab/Particle",
      transform: {
        position: {
          x: 0,
          y: 0
        }
      },
      args: {
        width: 100,
        height: 100,
        direction: 1,
        emitterConfig: {
          lifetime: { min: 1, max: 1 },
          frequency: 1e-3,
          spawnChance: 1,
          particlesPerWave: 2,
          emitterLifetime: 0.8,
          maxParticles: 150,
          addAtBack: false,
          autoUpdate: false,
          behaviors: [
            {
              type: "alpha",
              config: {
                alpha: {
                  list: [
                    { value: 2, time: 0 },
                    { value: 0.5, time: 1 }
                  ]
                }
              }
            },
            {
              type: "scale",
              config: {
                scale: {
                  list: [
                    { value: 0.8, time: 0 },
                    { value: 0.3, time: 1 }
                  ]
                }
              }
            },
            {
              type: "color",
              config: {
                color: {
                  list: [
                    { value: "ffffff", time: 0 },
                    { value: "ff4d4d", time: 1 }
                  ]
                }
              }
            },
            {
              type: "rotationStatic",
              config: {
                min: rotation,
                max: rotation
              }
            },
            {
              type: "moveSpeed",
              config: {
                speed: {
                  list: [
                    { value: 1e4, time: 0 },
                    { value: 9999, time: 1 }
                  ]
                }
              }
            },
            {
              type: "textureSingle",
              config: {
                texture: "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
              }
            }
          ]
        }
      }
    };
  };
  muzzleFlashDefinition = {
    entity: "@dreamlab/Particle",
    transform: {
      position: {
        x: 0,
        y: 0
      }
    },
    args: {
      width: 200,
      height: 200,
      direction: 1,
      emitterConfig: {
        lifetime: { min: 0.1, max: 0.2 },
        frequency: 1e-3,
        spawnChance: 1,
        particlesPerWave: 5,
        emitterLifetime: 0.1,
        maxParticles: 20,
        addAtBack: false,
        autoUpdate: false,
        behaviors: [
          {
            type: "alpha",
            config: {
              alpha: {
                list: [
                  { value: 1, time: 0 },
                  { value: 0, time: 1 }
                ]
              }
            }
          },
          {
            type: "scale",
            config: {
              scale: {
                list: [
                  { value: 1.5, time: 0 },
                  { value: 0.5, time: 1 }
                ]
              }
            }
          },
          {
            type: "colorStatic",
            config: {
              color: "ff4d4d"
            }
          },
          {
            type: "moveSpeed",
            config: {
              speed: {
                list: [
                  { value: 1e3, time: 0 },
                  { value: 500, time: 1 }
                ]
              }
            }
          },
          {
            type: "rotation",
            config: {
              minStart: 0,
              maxStart: 360,
              minSpeed: 0,
              maxSpeed: 0
            }
          },
          {
            type: "textureSingle",
            config: {
              texture: "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
            }
          }
        ]
      }
    }
  };
  smokeDefinition = {
    entity: "@dreamlab/Particle",
    transform: {
      position: {
        x: 0,
        y: 0
      }
    },
    args: {
      width: 200,
      height: 200,
      direction: 1,
      emitterConfig: {
        lifetime: { min: 0.5, max: 1 },
        frequency: 1e-3,
        spawnChance: 1,
        particlesPerWave: 5,
        emitterLifetime: 0.2,
        maxParticles: 20,
        addAtBack: false,
        autoUpdate: false,
        behaviors: [
          {
            type: "alpha",
            config: {
              alpha: {
                list: [
                  { value: 0.8, time: 0 },
                  { value: 0, time: 1 }
                ]
              }
            }
          },
          {
            type: "scale",
            config: {
              scale: {
                list: [
                  { value: 0.5, time: 0 },
                  { value: 2, time: 1 }
                ]
              }
            }
          },
          {
            type: "color",
            config: {
              color: {
                list: [
                  { value: "888888", time: 0 },
                  { value: "444444", time: 1 }
                ]
              }
            }
          },
          {
            type: "moveSpeed",
            config: {
              speed: {
                list: [
                  { value: 300, time: 0 },
                  { value: 50, time: 1 }
                ]
              }
            }
          },
          {
            type: "rotation",
            config: {
              minStart: 0,
              maxStart: 360,
              minSpeed: 20,
              maxSpeed: 50
            }
          },
          {
            type: "textureSingle",
            config: {
              texture: "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
            }
          }
        ]
      }
    }
  };
  constructor() {
    super();
    const netClient = onlyNetClient(game());
    magicEvents("common")?.on("onPlayerAttack", async (player, gear) => {
      if (player.currentAnimation !== "bow" && player.currentAnimation !== "shoot")
        return;
      if (!gear || Date.now() - (this.lastSpawnedTime || 0) <= ATTACK_COOLDOWN)
        return;
      this.lastSpawnedTime = Date.now();
      const invItem = inventoryManager_default.getInstance().getInventoryItemFromBaseGear(gear);
      this.direction = player.facing === "left" ? -1 : 1;
      const xOffset = player.currentAnimation === "shoot" ? this.direction * 245 : this.direction * 165;
      const yOffset = player.currentAnimation === "shoot" ? 125 : 75;
      this.attackPosition = {
        x: player.body.position.x + xOffset,
        y: player.body.position.y - yOffset
      };
      const newBullet = this.bulletDefinition(this.direction === 1 ? 0 : 180);
      newBullet.transform.position = this.attackPosition;
      game("client")?.spawn(newBullet);
      this.muzzleFlashDefinition.transform.position = this.attackPosition;
      game("client")?.spawn(this.muzzleFlashDefinition);
      this.smokeDefinition.transform.position = this.attackPosition;
      game("client")?.spawn(this.smokeDefinition);
      const startPoint = Matter.Vector.create(
        player.position.x,
        player.position.y
      );
      const endPoint = Matter.Vector.create(
        startPoint.x + 4e3 * Math.cos(this.direction === 1 ? 0 : Math.PI),
        startPoint.y + 4e3 * Math.sin(this.direction === 1 ? 0 : Math.PI)
      );
      const collisions = Matter.Query.ray(
        game().physics.engine.world.bodies,
        startPoint,
        endPoint,
        50
      ).filter(
        (collision) => collision.parentB.label === "solid" || collision.parentB.label === "zombie"
      );
      collisions.sort(
        (a, b) => this.direction === 1 ? a.parentB.position.x - b.parentB.position.x : b.parentB.position.x - a.parentB.position.x
      );
      for (const collision of collisions) {
        if (collision.parentB.label === "solid")
          break;
        if (collision.parentB.label === "zombie") {
          const targetZombie = collision.parentB;
          const entity = physics().getEntity(targetZombie);
          if (entity) {
            void netClient?.sendCustomMessage("@cvz/Hittable/hit", {
              uid: entity.uid,
              damage: invItem ? invItem.damage : 1
            });
          }
          break;
        }
      }
    });
  }
  teardown() {
  }
};

// runtime/worlds/dreamlab/survival/entities/regionManager.ts
import { Entity as Entity2, isSpawnableEntity } from "@dreamlab.gg/core";
import { game as game2 } from "@dreamlab.gg/core/dist/labs";
import { onlyNetClient as onlyNetClient2, onlyNetServer } from "@dreamlab.gg/core/dist/network";
import Matter2 from "matter-js";
var stopRegionInterval = (region) => {
  if (region.spawnIntervalId) {
    clearInterval(region.spawnIntervalId);
  }
  region.spawnIntervalId = void 0;
  events.emit("onRegionEnd", region.uid);
};
var isPlayerInRegion = (playerPosition, region) => {
  const buffer = 300;
  const isWithinXBounds = playerPosition.x >= region.position.x - region.width / 2 - buffer && playerPosition.x <= region.position.x + region.width / 2 + buffer;
  const isWithinYBounds = playerPosition.y >= region.position.y - region.height / 2 - buffer && playerPosition.y <= region.position.y + region.height / 2 + buffer;
  return isWithinXBounds && isWithinYBounds;
};
var getSpawnPosition = (region) => {
  const regionLeft = region.position.x - region.width / 2;
  const regionRight = region.position.x + region.width / 2;
  const regionTop = region.position.y - region.height / 2;
  const regionBottom = region.position.y + region.height / 2;
  const randomX = Math.random() * (regionRight - regionLeft) + regionLeft;
  const randomY = Math.random() * (regionBottom - regionTop) + regionTop;
  return { x: randomX, y: randomY };
};
var regions = /* @__PURE__ */ new Map();
var START_CHANNEL = "@cvz/Region/Start";
var END_CHANNEL = "@cvz/Region/End";
var onInstantiateRegion = (entity) => {
  if (!isSpawnableEntity(entity))
    return;
  if (entity.definition.entity.includes("SpawnRegion")) {
    const regionArgs = entity.args;
    const region = {
      uid: entity.uid,
      position: entity.transform.position,
      width: regionArgs.width,
      height: regionArgs.height,
      zombieTypes: regionArgs.zombieTypes,
      zombiesPerWave: regionArgs.zombiesPerWave,
      waves: regionArgs.waves,
      waveInterval: regionArgs.waveInterval,
      endCooldown: regionArgs.endCooldown,
      currentWave: 0,
      isInCooldown: false,
      spawnIntervalId: void 0
    };
    regions.set(region.uid, region);
  }
};
var onUpdateRegion = (entity) => {
  if (!isSpawnableEntity(entity))
    return;
  if (!entity.definition.entity.includes("SpawnRegion"))
    return;
  const regionArgs = entity.args;
  const updatedRegion = {
    uid: entity.uid,
    position: entity.transform.position,
    zombieTypes: regionArgs.zombieTypes,
    bounds: regionArgs.bounds,
    zombiesPerWave: regionArgs.zombiesPerWave,
    waves: regionArgs.waves,
    waveInterval: regionArgs.waveInterval,
    endCooldown: regionArgs.endCooldown,
    currentWave: 0,
    isInCooldown: false,
    spawnIntervalId: void 0
  };
  if (regions.has(updatedRegion.uid)) {
    const existingRegion = regions.get(updatedRegion.uid);
    if (existingRegion) {
      regions.set(updatedRegion.uid, {
        ...existingRegion,
        ...updatedRegion
      });
    }
  }
};
var onServerRegionEnd = async ({}, _, data) => {
  const { uid } = data;
  const region = regions.get(uid);
  if (region)
    stopRegionInterval(region);
};
var RegionManager = class extends Entity2 {
  constructor() {
    super();
    const netClient = onlyNetClient2(game2());
    const netServer = onlyNetServer(game2());
    const spawnZombies = async (region) => {
      const zombies = Matter2.Composite.allBodies(
        game2().physics.engine.world
      ).filter((b) => b.label === "zombie");
      if (zombies.length >= 30)
        return;
      events.emit("onRegionWaveStart", region.uid);
      const zombieCount = region.zombiesPerWave;
      const delay = async (ms) => new Promise((resolve2) => {
        setTimeout(resolve2, ms);
      });
      const positions = [];
      for (let idx = 0; idx < zombieCount; idx++) {
        const spawnPosition = getSpawnPosition(region);
        positions.push(spawnPosition);
      }
      events.emit("onRegionZombieSpawning", positions);
      await delay(3e3);
      const spawnPromises = positions.map(async (spawnPosition) => {
        const randomZombieTypeIndex = Math.floor(
          Math.random() * region.zombieTypes.length
        );
        const randomZombieType = region.zombieTypes[randomZombieTypeIndex];
        return game2().spawn({
          entity: "@cvz/ZombieMob",
          args: randomZombieType,
          transform: {
            position: [spawnPosition.x, spawnPosition.y],
            zIndex: 5
          },
          tags: [
            "net/replicated",
            "net/server-authoritative",
            "editor/doNotSave"
          ]
        });
      });
      await Promise.all(spawnPromises);
    };
    const manageRegionWaves = async (region) => {
      if (region.currentWave >= region.waves) {
        if (!region.isInCooldown) {
          region.isInCooldown = true;
          events.emit("onRegionCooldownStart", region.uid);
          setTimeout(() => {
            region.isInCooldown = false;
            region.currentWave = 0;
            events.emit("onRegionCooldownEnd", region.uid);
            stopRegionInterval(region);
          }, region.endCooldown * 1e3);
        }
      } else {
        await spawnZombies(region);
        region.currentWave++;
        if (region.currentWave < region.waves) {
          const interval = setTimeout(
            async () => manageRegionWaves(region),
            Math.max(region.waveInterval - 3, 0) * 1e3
          );
          region.spawnIntervalId = interval;
        } else {
          await manageRegionWaves(region);
        }
      }
    };
    const onServerRegionStart = async ({}, _, data) => {
      if (!netServer)
        throw new Error("missing network");
      const { uid } = data;
      const region = regions.get(uid);
      if (region) {
        if (region.isInCooldown || region.spawnIntervalId) {
          return;
        }
        await manageRegionWaves(region);
        events.emit("onRegionStart", region.uid);
      }
    };
    const onEnterRegion = async (uid) => {
      const region = regions.get(uid);
      if (!region)
        return;
      await netClient?.sendCustomMessage(START_CHANNEL, { uid });
    };
    const onExitRegion = async (uid) => {
      const region = regions.get(uid);
      if (!region)
        return;
      const players = Matter2.Composite.allBodies(
        game2().physics.engine.world
      ).filter(
        (b) => b.label === "player" && isPlayerInRegion({ x: b.position.x, y: b.position.y }, region)
      );
      if (players.length === 0) {
        await netClient?.sendCustomMessage(END_CHANNEL, { uid });
      }
    };
    netServer?.addCustomMessageListener(START_CHANNEL, onServerRegionStart);
    netServer?.addCustomMessageListener(END_CHANNEL, onServerRegionEnd);
    game2().events.common.addListener("onInstantiate", onInstantiateRegion);
    game2().events.common.addListener("onArgsChanged", onUpdateRegion);
    events.addListener("onEnterRegion", onEnterRegion);
    events.addListener("onExitRegion", onExitRegion);
  }
  teardown() {
    const netServer = onlyNetServer(game2());
    netServer?.removeCustomMessageListener(END_CHANNEL, onServerRegionEnd);
    game2().events.common.removeListener("onInstantiate", onInstantiateRegion);
    game2().events.common.removeListener("onArgsChanged", onUpdateRegion);
  }
};

// runtime/worlds/dreamlab/survival/entities/spawnable/grappleHook.ts
import { Solid, SolidArgs } from "@dreamlab.gg/core/dist/entities";
import { camera, game as game3 } from "@dreamlab.gg/core/dist/labs";
import { z } from "@dreamlab.gg/core/dist/sdk";
import { distance, Vec } from "@dreamlab.gg/core/math";
import Matter3 from "matter-js";
var ArgsSchema = SolidArgs.extend({
  mustConnectWithBody: z.boolean()
});
var GrappleHook = class extends Solid {
  cursorPosition = void 0;
  hasReachedTarget = false;
  constructor(ctx) {
    super(ctx);
    this.body.collisionFilter = {
      category: 4,
      mask: 0
    };
    this.body.frictionAir = 0.2;
    this.body.label = "grappleHook";
    if (!this.args.mustConnectWithBody)
      this.args.mustConnectWithBody = false;
    const $game = game3("client");
    if (!$game)
      return;
    $game.client?.render.container.addEventListener("pointerover", (ev) => () => {
      const screenPosition = Vec.create(ev.offsetX, ev.offsetY);
      this.cursorPosition = camera().screenToWorld(screenPosition);
    });
    $game.client?.render.container.addEventListener("pointerout", () => {
      this.cursorPosition = void 0;
    });
    $game.client?.render.container.addEventListener("pointermove", (ev) => () => {
      const screenPosition = Vec.create(ev.offsetX, ev.offsetY);
      this.cursorPosition = camera().screenToWorld(screenPosition);
    });
  }
  onPhysicsStep(_) {
    const $game = game3("client");
    if (!$game) {
      return;
    }
    Matter3.Body.setAngle(this.body, 0);
    Matter3.Body.setAngularVelocity(this.body, 0);
    const playerBody = Matter3.Composite.allBodies(
      $game.physics.engine.world
    ).find((b) => b.label === "player");
    if (!playerBody)
      return;
    const inputs = $game.client?.inputs;
    const isCrouching = inputs?.getInput("@cvz/hook") ?? false;
    if (isCrouching && this.cursorPosition) {
      if (this.args.mustConnectWithBody) {
        const bodiesAtCursor = Matter3.Query.point(
          Matter3.Composite.allBodies($game.physics.engine.world),
          this.cursorPosition
        );
        if (bodiesAtCursor.length === 0) {
          return;
        }
      }
      if (this.body.render.visible === false) {
        Matter3.Body.setPosition(this.body, playerBody.position);
        this.body.render.visible = true;
      }
      const reachedTarget = distance(this.body.position, this.cursorPosition) <= 1;
      if (!reachedTarget) {
        const dir = Vec.normalise(
          Vec.sub(this.cursorPosition, this.body.position)
        );
        const forceMagnitude = 5e-3;
        const force = Vec.mult(dir, forceMagnitude);
        Matter3.Body.applyForce(this.body, this.body.position, force);
      } else {
        this.hasReachedTarget = true;
        Matter3.Body.setVelocity(this.body, { x: 0, y: 0 });
        const playerToHookDirection = Vec.normalise(
          Vec.sub(this.body.position, playerBody.position)
        );
        const pullForceMagnitude = 1.5;
        const pullForce = Vec.mult(playerToHookDirection, pullForceMagnitude);
        Matter3.Body.applyForce(playerBody, playerBody.position, pullForce);
      }
    } else if (!isCrouching) {
      this.body.render.visible = false;
    }
  }
  onRenderFrame(time) {
    super.onRenderFrame(time);
    const $game = game3("client");
    if (!$game) {
      return;
    }
    if (this.body.render.visible) {
      const debug3 = $game.debug;
      const pos = Vec.add(this.body.position, camera().offset);
      this.gfx.visible = true;
      this.container.position = pos;
      if (!this.hasReachedTarget && this.cursorPosition) {
        const dx = this.cursorPosition.x - this.body.position.x;
        const dy = this.cursorPosition.y - this.body.position.y;
        const angle = Math.atan2(dy, dx);
        this.container.rotation = angle;
      } else {
        this.container.rotation = this.body.angle;
      }
      const alpha = debug3.value ? 0.5 : 0;
      this.gfx.alpha = alpha;
      if (this.sprite) {
        this.sprite.visible = this.body.render.visible;
      }
    } else {
      this.gfx.visible = false;
      this.hasReachedTarget = false;
      if (this.sprite) {
        this.sprite.visible = false;
      }
    }
  }
};

// runtime/worlds/dreamlab/survival/entities/spawnable/inventoryItem.ts
import {
  camera as camera2,
  debug,
  game as game4,
  events as magicEvent
} from "@dreamlab.gg/core/dist/labs";
import { Solid as Solid2, SolidArgs as SolidArgs2 } from "@dreamlab.gg/core/entities";
import { createGear } from "@dreamlab.gg/core/managers";
import { Vec as Vec2 } from "@dreamlab.gg/core/math";
import { z as z2 } from "@dreamlab.gg/core/sdk";
var ArgsSchema2 = SolidArgs2.extend({
  displayName: z2.string().default("Default Item"),
  animationName: z2.enum(["bow", "shoot", "greatsword", "idle", "jump", "jog", "walk"]).default("shoot"),
  damage: z2.number().default(1),
  range: z2.number().default(1),
  lore: z2.string().default("Default Item Lore"),
  bone: z2.enum(["handLeft", "handRight"]).default("handRight"),
  anchorX: z2.number().default(0.5),
  anchorY: z2.number().default(0.5),
  rotation: z2.number().default(0),
  speedMultiplier: z2.number().optional().default(1)
});
var Item = class extends Solid2 {
  onPlayerCollisionStart;
  onPlayerCollisionEnd;
  time = 0;
  floatHeight = 5;
  rotationSpeed = 6e-3;
  constructor(ctx) {
    super(ctx);
    this.body.isSensor = true;
    this.body.isStatic = true;
    this.body.label = "inventoryItem";
    const $game = game4();
    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart = ([player, other]) => {
        if (this.body && other === this.body && $game.client) {
          const baseGear = {
            displayName: this.args.displayName,
            textureURL: this.args.spriteSource?.url ?? "",
            animationName: this.args.animationName,
            anchor: { x: this.args.anchorX, y: this.args.anchorY },
            rotation: this.args.rotation,
            bone: this.args.bone,
            speedMultiplier: this.args.speedMultiplier
          };
          const newItem = createGear(baseGear);
          const inventoryItem = {
            baseGear: newItem,
            lore: this.args.lore,
            damage: this.args.damage,
            range: this.args.range,
            value: 100
          };
          events.emit("onPlayerNearItem", player, inventoryItem);
        }
      }
    );
    magicEvent("client")?.on(
      "onPlayerCollisionEnd",
      this.onPlayerCollisionEnd = ([player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPlayerNearItem", player, void 0);
        }
      }
    );
  }
  teardown() {
    super.teardown();
    magicEvent("client")?.removeListener(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart
    );
    magicEvent("client")?.removeListener(
      "onPlayerCollisionEnd",
      this.onPlayerCollisionEnd
    );
  }
  onRenderFrame(_time) {
    this.time += 0.05;
    const yOffset = Math.sin(this.time) * this.floatHeight;
    const pos = Vec2.add(this.transform.position, camera2().offset);
    pos.y += yOffset;
    this.container.rotation += this.rotationSpeed;
    this.container.position = pos;
    if (this.gfx)
      this.gfx.alpha = debug() ? 0.5 : 0;
  }
};

// runtime/worlds/dreamlab/survival/entities/spawnable/spawnRegion.ts
import {
  camera as camera3,
  game as game5,
  events as magicEvents2
} from "@dreamlab.gg/core/dist/labs";
import { drawCircle } from "@dreamlab.gg/core/dist/utils";
import { Solid as Solid3, SolidArgs as SolidArgs3 } from "@dreamlab.gg/core/entities";
import { syncedValue } from "@dreamlab.gg/core/network";
import { z as z3 } from "@dreamlab.gg/core/sdk";
var ArgsSchema3 = SolidArgs3.extend({
  zombieTypes: z3.array(
    z3.object({
      width: z3.number(),
      height: z3.number(),
      maxHealth: z3.number(),
      speed: z3.number(),
      knockback: z3.number()
    })
  ).default([
    {
      width: 100,
      height: 200,
      maxHealth: 10,
      speed: 3,
      knockback: 1.25
    }
  ]),
  zombiesPerWave: z3.number().default(1),
  waves: z3.number().default(3),
  waveInterval: z3.number().default(25),
  endCooldown: z3.number().default(15)
});
var SpawnRegion = class extends Solid3 {
  gfxCircle;
  regionData = syncedValue(
    game5(),
    this.uid,
    "regionData",
    {
      isCooldown: false,
      waveStarted: false,
      regionActive: false,
      positions: void 0
    }
  );
  onPlayerCollisionStart;
  onPlayerCollisionEnd;
  onRegionZombieSpawning;
  onRegionCooldownStart;
  onRegionCooldownEnd;
  onRegionWaveStart;
  onRegionStart;
  onRegionEnd;
  constructor(ctx) {
    super(ctx);
    this.body.isSensor = true;
    this.body.label = "spawnRegion";
    magicEvents2("client")?.addListener(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart = ([_player, other]) => {
        if (other.id === this.body.id) {
          events.emit("onEnterRegion", this.uid);
        }
      }
    );
    magicEvents2("client")?.on(
      "onPlayerCollisionEnd",
      this.onPlayerCollisionEnd = ([_player, other]) => {
        if (other.id === this.body.id) {
          events.emit("onExitRegion", this.uid);
        }
      }
    );
    events.addListener(
      "onRegionZombieSpawning",
      this.onRegionZombieSpawning = (positions) => {
        this.regionData.value.positions = Array.isArray(positions) ? positions : void 0;
        setTimeout(() => {
          this.regionData.value.positions = void 0;
        }, 3e3);
      }
    );
    events.addListener(
      "onRegionCooldownStart",
      this.onRegionCooldownStart = (regionId) => {
        if (this.uid === regionId) {
          this.regionData.value.isCooldown = true;
        }
      }
    );
    events.addListener(
      "onRegionCooldownEnd",
      this.onRegionCooldownEnd = (regionId) => {
        if (this.uid === regionId) {
          this.regionData.value.isCooldown = false;
        }
      }
    );
    events.addListener(
      "onRegionWaveStart",
      this.onRegionWaveStart = (regionId) => {
        if (this.uid === regionId) {
          this.regionData.value.waveStarted = true;
          setTimeout(() => {
            this.regionData.value.waveStarted = false;
          }, 3e3);
        }
      }
    );
    events.addListener(
      "onRegionStart",
      this.onRegionStart = (regionId) => {
        if (this.uid === regionId) {
          this.regionData.value.regionActive = true;
        }
      }
    );
    events.addListener(
      "onRegionEnd",
      this.onRegionEnd = (regionId) => {
        if (this.uid === regionId) {
          this.regionData.value.regionActive = false;
        }
      }
    );
    const $game = game5("client");
    if ($game) {
      this.gfxCircle = drawCircle({ radius: 75 });
      this.gfxCircle.zIndex = -1;
      this.container?.addChild(this.gfxCircle);
    }
  }
  teardown() {
    super.teardown();
    magicEvents2("client")?.removeListener(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart
    );
    magicEvents2("client")?.removeListener(
      "onPlayerCollisionEnd",
      this.onPlayerCollisionEnd
    );
    events.removeListener(
      "onRegionZombieSpawning",
      this.onRegionZombieSpawning
    );
    events.removeListener("onRegionCooldownStart", this.onRegionCooldownStart);
    events.removeListener("onRegionCooldownEnd", this.onRegionCooldownEnd);
    events.removeListener("onRegionWaveStart", this.onRegionWaveStart);
    events.removeListener("onRegionStart", this.onRegionStart);
    events.removeListener("onRegionEnd", this.onRegionEnd);
  }
  onRenderFrame(time) {
    super.onRenderFrame(time);
    this.gfx.clear();
    this.gfxCircle.clear();
    let fillAlpha = 0;
    let fillColor = 0;
    const strokeAlpha = 1;
    let strokeColor = 0;
    const strokeWidth = 8;
    if (this.regionData.value.regionActive)
      strokeColor = 3700253;
    if (this.regionData.value.isCooldown) {
      fillColor = 8765929;
      fillAlpha = 0.5;
      strokeColor = 3447003;
    }
    if (this.regionData.value.waveStarted) {
      fillColor = 0;
      fillAlpha = 0;
      strokeColor = 10158080;
    }
    this.gfx?.redraw(
      { width: this.args.width, height: this.args.height },
      {
        fill: fillColor,
        fillAlpha,
        stroke: strokeColor,
        strokeWidth,
        strokeAlpha
      }
    );
    const pulseColors = [16711680, 13697024];
    const timeBasedIndex = Math.floor(Date.now() / 250) % pulseColors.length;
    const currentColor = pulseColors[timeBasedIndex];
    if (this.regionData.value.positions) {
      for (const { x, y } of Object.values(this.regionData.value.positions)) {
        const adjustedX = x + camera3().offset.x - this.container.position.x;
        const adjustedY = y + camera3().offset.y - this.container.position.y;
        this.gfxCircle.redraw(
          { radius: 75 },
          {
            fill: currentColor,
            fillAlpha: 0.5
          }
        );
        this.gfxCircle.position.set(adjustedX, adjustedY);
      }
    }
  }
};

// runtime/worlds/dreamlab/survival/entities/spawnable/zombie.ts
import { SpawnableEntity } from "@dreamlab.gg/core";
import {
  camera as camera4,
  debug as debug2,
  game as game6,
  events as magicEvents3,
  physics as physics2,
  stage
} from "@dreamlab.gg/core/dist/labs";
import { z as z4 } from "@dreamlab.gg/core/dist/sdk";
import { SpriteSourceSchema } from "@dreamlab.gg/core/dist/textures";
import { isNetPlayer } from "@dreamlab.gg/core/entities";
import { simpleBoundsTest, toRadians, Vec as Vec3 } from "@dreamlab.gg/core/math";
import {
  onlyNetClient as onlyNetClient3,
  onlyNetServer as onlyNetServer2,
  syncedValue as syncedValue2
} from "@dreamlab.gg/core/network";
import {
  deferUntilPhysicsStep,
  drawBox,
  drawCircle as drawCircle2
} from "@dreamlab.gg/core/utils";
import Matter4 from "matter-js";
import { AnimatedSprite, Container } from "pixi.js";
var ArgsSchema4 = z4.object({
  width: z4.number().positive().min(1).default(200),
  height: z4.number().positive().min(1).default(200),
  spriteSource: SpriteSourceSchema.optional(),
  maxHealth: z4.number().positive().min(1).default(10),
  speed: z4.number().positive().min(1).default(1),
  knockback: z4.number().positive().min(0).default(2)
});
var Zombie = class extends SpawnableEntity {
  body;
  sprite;
  container;
  healthContainer;
  gfx;
  gfxHitBox;
  gfxHealthBorder;
  gfxHealthAmount;
  onPlayerAttack;
  onPlayerCollisionStart;
  onHitServer;
  netServer;
  netClient;
  HIT_CHANNEL = "@cvz/Hittable/hit";
  patrolDistance = 300;
  hitCooldown = 0.5;
  // Second(s)
  zombieAnimations = {};
  mobData = syncedValue2(this.uid, "mobData", {
    health: this.args.maxHealth,
    direction: 1,
    hitCooldown: 0,
    patrolDistance: 0,
    currentAnimation: "walk",
    directionCooldown: 0
  });
  constructor(ctx, { stroke = "green" } = {}) {
    super(ctx);
    this.body = Matter4.Bodies.rectangle(
      this.transform.position.x,
      this.transform.position.y,
      this.args.width,
      this.args.height,
      {
        label: "zombie",
        inertia: Number.POSITIVE_INFINITY
      }
    );
    if (!this.tags.includes("net/replicated")) {
      this.tags.push(
        "net/replicated",
        "net/server-authoritative",
        "editor/doNotSave"
      );
    }
    this.netServer = onlyNetServer2(game6());
    this.netClient = onlyNetClient3(game6());
    physics2().register(this, this.body);
    physics2().linkTransform(this.body, this.transform);
    this.onPlayerAttack = async (player, gear) => {
      if (this.mobData.value.hitCooldown > 0 || ["bow", "shoot"].includes(gear?.animationName || "")) {
        return;
      }
      const playerPositionX = player.body.position.x;
      const mobPositionX = this.body.position.x;
      const xDiff = playerPositionX - mobPositionX;
      let damage = 1;
      let range = this.args.width / 2 + 120;
      if (gear) {
        const inventoryManager = inventoryManager_default.getInstance();
        const inventoryItem = inventoryManager.getInventoryItemFromBaseGear(gear);
        if (inventoryItem) {
          damage = inventoryItem.damage;
          range *= Math.max(inventoryItem.range, 1);
        }
      }
      if (Math.abs(xDiff) <= range) {
        await this.netClient?.sendCustomMessage(this.HIT_CHANNEL, {
          uid: this.uid,
          damage
        });
        if (this.mobData.value.health - damage <= 0) {
          events.emit("onPlayerScore", this.args.maxHealth * 25);
        }
      }
    };
    this.onPlayerCollisionStart = ([player, other]) => {
      if (this.body && other === this.body) {
        const heightDifference = player.body.position.y - this.body.position.y;
        const mobHeight = this.body.bounds.max.y - this.body.bounds.min.y;
        const threshold = mobHeight;
        if (heightDifference < -threshold) {
          const damage = 2;
          void this.netClient?.sendCustomMessage(this.HIT_CHANNEL, {
            uid: this.uid,
            damage
          });
          const bounceForce = { x: 0, y: -4 };
          deferUntilPhysicsStep(() => {
            Matter4.Body.applyForce(
              player.body,
              player.body.position,
              bounceForce
            );
          });
        } else {
          events.emit("onPlayerDamage", 1);
          const forceDirection = this.mobData.value.direction;
          const forceMagnitude = 4 * forceDirection;
          deferUntilPhysicsStep(() => {
            Matter4.Body.applyForce(player.body, player.body.position, {
              x: forceMagnitude,
              y: -1
            });
          });
        }
      }
    };
    this.onHitServer = async ({ peerID }, _, data) => {
      if (!this.netServer)
        throw new Error("missing network");
      const { uid: dataUid, damage } = data;
      if (dataUid !== this.uid || typeof damage !== "number")
        return;
      const player = game6().entities.find(
        (ev) => isNetPlayer(ev) && ev.connectionId === peerID
      );
      if (!player)
        throw new Error("missing netplayer");
      if (this.mobData.value.hitCooldown > 0)
        return;
      this.mobData.value.hitCooldown = this.hitCooldown * 60;
      Matter4.Body.applyForce(this.body, this.body.position, {
        x: this.args.knockback * -this.mobData.value.direction,
        y: -1.75
      });
      this.mobData.value.health -= damage;
      if (this.mobData.value.health <= 0)
        game6().destroy(this);
    };
    this.netServer?.addCustomMessageListener(
      this.HIT_CHANNEL,
      this.onHitServer
    );
    magicEvents3("client")?.on(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart
    );
    magicEvents3("common")?.on("onPlayerAttack", this.onPlayerAttack);
    const $game = game6("client");
    if ($game) {
      const assets = getPreloadedAssets();
      this.zombieAnimations.walk = assets.walkTextures;
      this.zombieAnimations.recoil = assets.recoilTextures;
      this.zombieAnimations.punch = assets.punchTextures;
      this.sprite = new AnimatedSprite(this.zombieAnimations.walk);
      this.sprite.gotoAndPlay(0);
      this.sprite.anchor.set(0.45, 0.535);
      const originalWidth = this.sprite.texture.width;
      const originalHeight = this.sprite.texture.height;
      const scaleX = this.args.width * 1.5 / originalWidth;
      const scaleY = this.args.height * 1.5 / originalHeight;
      const uniformScale = Math.max(scaleX, scaleY);
      this.sprite.scale.set(uniformScale, uniformScale);
      this.sprite.zIndex = this.transform.zIndex;
      this.container = new Container();
      this.container.sortableChildren = true;
      this.container.zIndex = this.transform.zIndex;
      this.healthContainer = new Container();
      this.healthContainer.sortableChildren = true;
      this.healthContainer.zIndex = 1;
      this.healthContainer.position.y = -this.args.height / 2 - 30;
      this.gfx = drawBox(
        { width: this.args.width, height: this.args.height },
        { stroke }
      );
      this.gfxHitBox = drawCircle2(
        { radius: this.args.width / 2 + 120 },
        { fill: "red", fillAlpha: 1, strokeAlpha: 0 }
      );
      this.gfxHitBox.zIndex = -1;
      this.gfxHealthAmount = drawBox(
        {
          width: this.mobData.value.health / this.args.maxHealth * this.args.width + 50,
          height: 20
        },
        { fill: "red", fillAlpha: 1, strokeAlpha: 0 }
      );
      this.gfxHealthBorder = drawBox(
        { width: this.args.width + 50, height: 20 },
        {
          fill: "white",
          stroke: "black",
          fillAlpha: 1,
          strokeAlign: 1,
          strokeWidth: 4
        }
      );
      this.healthContainer.addChild(this.gfxHealthBorder);
      this.healthContainer.addChild(this.gfxHealthAmount);
      this.container.addChild(this.gfx);
      this.container.addChild(this.gfxHitBox);
      this.container.addChild(this.healthContainer);
      if (this.sprite)
        stage().addChild(this.sprite);
      stage().addChild(this.container);
      this.transform.addZIndexListener(() => {
        if (this.container)
          this.container.zIndex = this.transform.zIndex;
      });
    }
  }
  bounds() {
    const { width, height } = this.args;
    return { width, height };
  }
  isPointInside(point) {
    const { width, height } = this.args;
    return simpleBoundsTest({ width, height }, this.transform, point);
  }
  onArgsUpdate(path, previous) {
    if (path === "width" || path === "height") {
      const { width: originalWidth, height: originalHeight } = previous;
      const { width, height } = this.args;
      const scaleX = width / originalWidth;
      const scaleY = height / originalHeight;
      Matter4.Body.setAngle(this.body, 0);
      Matter4.Body.scale(this.body, scaleX, scaleY);
      Matter4.Body.setAngle(this.body, toRadians(this.transform.rotation));
      this.gfx?.redraw(this.args);
      this.gfxHitBox?.redraw({ radius: this.args.width / 2 + 120 });
      this.gfxHealthBorder?.redraw({ width: this.args.width + 50, height: 20 });
      if (this.healthContainer)
        this.healthContainer.position.y = -this.args.height / 2 - 30;
      if (this.sprite) {
        this.sprite.width = width;
        this.sprite.height = height;
      }
    }
  }
  onResize(bounds) {
    this.args.width = bounds.width;
    this.args.height = bounds.height;
  }
  teardown() {
    physics2().unregister(this, this.body);
    this.container?.destroy({ children: true });
    this.sprite?.destroy();
    magicEvents3().common.removeListener("onPlayerAttack", this.onPlayerAttack);
    magicEvents3().client?.removeListener(
      "onPlayerCollisionStart",
      this.onPlayerCollisionStart
    );
    if (this.onHitServer)
      this.netServer?.removeCustomMessageListener(
        this.HIT_CHANNEL,
        this.onHitServer
      );
  }
  async onPhysicsStep(_) {
    if (game6().client)
      return;
    Matter4.Body.setAngle(this.body, 0);
    Matter4.Body.setAngularVelocity(this.body, 0);
    this.mobData.value.hitCooldown = Math.max(
      0,
      this.mobData.value.hitCooldown - 1
    );
    this.mobData.value.directionCooldown = Math.max(
      0,
      this.mobData.value.directionCooldown - 1
    );
    let closestPlayer = null;
    let minDistance = Number.POSITIVE_INFINITY;
    const searchArea = {
      min: { x: this.body.position.x - 5e3, y: this.body.position.y - 5e3 },
      max: { x: this.body.position.x + 5e3, y: this.body.position.y + 5e3 }
    };
    const playerBodies = game6().entities.flatMap(
      (entity) => isNetPlayer(entity) && entity.body ? [entity.body] : []
    );
    const playersInRegion = Matter4.Query.region(playerBodies, searchArea);
    for (const player of playersInRegion) {
      const dx = player.position.x - this.body.position.x;
      const dy = player.position.y - this.body.position.y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared < minDistance) {
        minDistance = distanceSquared;
        closestPlayer = player;
      }
    }
    minDistance = Math.sqrt(minDistance);
    if (this.mobData.value.hitCooldown > 0) {
      this.mobData.value.currentAnimation = "recoil";
    } else if (closestPlayer && minDistance < 150) {
      this.mobData.value.currentAnimation = "punch";
    } else if (this.mobData.value.currentAnimation !== "walk") {
      this.mobData.value.currentAnimation = "walk";
    }
    if (closestPlayer && minDistance < 2e3) {
      const verticalDistance = Math.abs(
        closestPlayer.position.y - this.body.position.y
      );
      const horizontalDistance = Math.abs(
        closestPlayer.position.x - this.body.position.x
      );
      if (verticalDistance < horizontalDistance && this.mobData.value.directionCooldown === 0) {
        this.mobData.value.direction = closestPlayer.position.x > this.body.position.x ? 1 : -1;
        this.mobData.value.directionCooldown = 1;
      }
      Matter4.Body.translate(this.body, {
        x: this.args.speed * this.mobData.value.direction,
        y: 0
      });
    } else {
      if (this.mobData.value.patrolDistance > this.patrolDistance) {
        this.mobData.value.patrolDistance = 0;
        this.mobData.value.direction *= -1;
      }
      Matter4.Body.translate(this.body, {
        x: this.args.speed / 2 * this.mobData.value.direction,
        y: 0
      });
      this.mobData.value.patrolDistance += Math.abs(this.args.speed / 2);
    }
    if (!closestPlayer || minDistance > 5e3) {
      game6().destroy(this);
    }
  }
  onRenderFrame(_) {
    const pos = Vec3.add(this.transform.position, camera4().offset);
    if (this.sprite) {
      this.sprite.scale.x = -this.mobData.value.direction;
      this.sprite.position = pos;
      if (this.sprite.textures !== this.zombieAnimations[this.mobData.value.currentAnimation]) {
        this.sprite.textures = this.zombieAnimations[this.mobData.value.currentAnimation];
        this.sprite.gotoAndPlay(0);
      }
    }
    if (this.container) {
      this.container.position = pos;
      this.container.angle = this.transform.rotation;
    }
    const alpha = debug2() ? 0.5 : 0;
    if (this.gfx)
      this.gfx.alpha = alpha;
    if (this.gfxHitBox)
      this.gfxHitBox.alpha = this.mobData.value.hitCooldown === 0 ? alpha / 3 : 0;
    this.gfxHealthAmount?.redraw({
      width: this.mobData.value.health / this.args.maxHealth * this.args.width + 50,
      height: 20
    });
  }
};

// runtime/worlds/dreamlab/survival/shared.ts
var sharedInit = async (game7) => {
  game7.register("@cvz/ZombieMob", Zombie, ArgsSchema4);
  game7.register("@cvz/Hook", GrappleHook, ArgsSchema);
  game7.register("@cvz/SpawnRegion", SpawnRegion, ArgsSchema3);
  game7.register("@cvz/InventoryItem", Item, ArgsSchema2);
  game7.instantiate(new ParticleSpawner());
  game7.instantiate(new RegionManager());
};

// runtime/worlds/dreamlab/survival/ui/startScreen.tsx
import { renderUI, useGame, usePlayer as usePlayer3 } from "@dreamlab.gg/ui/react";
import { useState as useState6 } from "https://esm.sh/react@18.2.0";

// runtime/worlds/dreamlab/survival/inventory/inventoryApp.tsx
import { useInput, usePlayer } from "@dreamlab.gg/ui/react";
import { useCallback, useEffect, useState as useState2 } from "https://esm.sh/react@18.2.0";

// runtime/worlds/dreamlab/survival/inventory/inventorySlot.tsx
import { useState } from "https://esm.sh/react@18.2.0";

// runtime/worlds/dreamlab/survival/inventory/inventoryStyle.ts
var inventoryStyles = {
  inventory: {
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    border: "3px solid #5b4b4b",
    width: "475px",
    backgroundColor: "rgba(44, 42, 41, 0.9)",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Courier New', Courier, monospace"
  },
  inventoryTitle: {
    color: "#9e8a7c",
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px #7f0000"
  },
  inventoryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px"
  },
  inventorySlot: {
    width: "50px",
    height: "50px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    borderRadius: "8px"
  },
  inventorySlotHover: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05)"
  },
  inventoryHotbarSlots: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    borderTop: "2px solid #9e8a7c",
    paddingTop: "10px"
  },
  hotbarSlots: {
    display: "flex",
    justifyContent: "center",
    background: "#9e8a7c",
    borderRadius: "8px",
    padding: "5px 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)"
  },
  itemTooltip: {
    position: "absolute",
    zIndex: 1e3,
    top: "0",
    right: "0",
    transform: "translateX(100%) translateY(-100%)",
    padding: "8px 12px",
    borderRadius: "6px",
    backgroundColor: "rgba(21, 32, 43, 0.9)",
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: "0.875rem",
    lineHeight: "1.4",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5), 0px 20px 20px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "opacity 0.2s ease-out",
    opacity: 0
  }
};

// runtime/worlds/dreamlab/survival/inventory/inventorySlot.tsx
import { jsx, jsxs } from "https://esm.sh/react@18.2.0/jsx-runtime";
var InventorySlot = ({ slot }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const combinedStyles = {
    ...inventoryStyles.inventorySlot,
    ...isHovered ? inventoryStyles.inventorySlotHover : {},
    border: slot ? "2px solid #9e8a7c" : "2px solid transparent"
  };
  const renderTooltipContent = () => {
    if (!slot?.baseGear)
      return null;
    const { baseGear: baseItem, damage, range } = slot;
    const { displayName, speedMultiplier } = baseItem;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { children: displayName }),
      /* @__PURE__ */ jsxs("div", { children: [
        "Damage: ",
        damage
      ] }),
      slot.baseGear.animationName === "greatsword" && /* @__PURE__ */ jsxs("div", { children: [
        "Range: ",
        range
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        "Attack Speed: ",
        speedMultiplier ?? 1
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onDragEnd: () => setIsDragging(false),
      onDragStart: () => setIsDragging(true),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: combinedStyles,
      children: [
        slot?.baseGear?.textureURL && /* @__PURE__ */ jsx(
          "img",
          {
            alt: slot.baseGear?.displayName,
            className: "inventorySprite",
            draggable: true,
            height: "50",
            src: slot.baseGear?.textureURL,
            width: "50"
          }
        ),
        isHovered && !isDragging && /* @__PURE__ */ jsx("div", { style: { ...inventoryStyles.itemTooltip, opacity: 1 }, children: renderTooltipContent() })
      ]
    }
  );
};
var inventorySlot_default = InventorySlot;

// runtime/worlds/dreamlab/survival/inventory/inventory.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var chunkArray = (array, size) => {
  const result = [];
  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size));
  }
  return result;
};
var Inventory = ({
  data,
  onClick,
  onDragStart,
  onDragEnd
}) => {
  const numCols = 9;
  const chunkedData = chunkArray(data, numCols);
  const createSlot = (slot, slotIndex, offset = 0) => {
    const index = offset + slotIndex;
    return /* @__PURE__ */ jsx2(
      "div",
      {
        draggable: Boolean(slot),
        onClick: () => onClick(index),
        onDragOver: (ev) => ev.preventDefault(),
        onDragStart: (ev) => {
          if (!slot) {
            ev.preventDefault();
            return;
          }
          onDragStart(index);
        },
        onDrop: () => onDragEnd(index),
        style: inventoryStyles.inventorySlot,
        children: slot && /* @__PURE__ */ jsx2(inventorySlot_default, { slot })
      },
      slotIndex
    );
  };
  return /* @__PURE__ */ jsxs2("div", { style: inventoryStyles.inventory, children: [
    /* @__PURE__ */ jsx2("h2", { style: inventoryStyles.inventoryTitle, children: "Inventory" }),
    chunkedData.slice(1).map((row, rowIndex) => (
      // eslint-disable-next-line react/no-array-index-key
      /* @__PURE__ */ jsx2("div", { style: inventoryStyles.inventoryRow, children: row.map(
        (slot, slotIndex) => createSlot(slot, slotIndex, (rowIndex + 1) * numCols)
      ) }, rowIndex)
    )),
    /* @__PURE__ */ jsx2("div", { style: inventoryStyles.inventoryHotbarSlots, children: chunkedData[0]?.map((slot, slotIndex) => createSlot(slot, slotIndex)) })
  ] });
};
var inventory_default = Inventory;

// runtime/worlds/dreamlab/survival/inventory/inventoryHotbar.tsx
import { jsx as jsx3 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var InventoryHotbar = ({
  inventoryData,
  activeSlot
}) => {
  const firstRow = inventoryData.slice(0, 9);
  const slotStyle = {
    ...inventoryStyles.inventorySlot,
    margin: "0 3px",
    transition: "transform 0.3s ease"
  };
  const activeSlotStyle = {
    ...slotStyle,
    boxShadow: "0 0 10px #7f0000",
    transform: "scale(1.1)",
    zIndex: 10
  };
  return /* @__PURE__ */ jsx3(
    "div",
    {
      style: {
        ...inventoryStyles.hotbarSlots,
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center"
      },
      children: firstRow.map((item, index) => {
        return /* @__PURE__ */ jsx3(
          "div",
          {
            style: index === activeSlot ? activeSlotStyle : slotStyle,
            children: item?.baseGear ? /* @__PURE__ */ jsx3(
              "img",
              {
                alt: item.baseGear.displayName,
                src: item.baseGear.textureURL,
                style: { width: "100%", height: "100%" }
              }
            ) : /* @__PURE__ */ jsx3("div", { style: { ...slotStyle } })
          },
          index
        );
      })
    }
  );
};
var inventoryHotbar_default = InventoryHotbar;

// runtime/worlds/dreamlab/survival/inventory/listeners/inventoryClick.ts
var handleInventoryClick = (event) => {
  console.log(`Slot at [${event.cursorSlot}] was clicked`);
};

// runtime/worlds/dreamlab/survival/inventory/listeners/inventoryDrag.ts
var handleInventoryDragStart = (event) => {
  console.log(`Started dragging from slot [${event.cursorSlot}]`);
  event.setSourceSlot(event.cursorSlot);
};
var handleInventoryDragEnd = (event) => {
  const invData = inventoryManager_default.getInstance().getInventoryData();
  console.log(
    `Ended dragging from slot [${event.sourceSlot}] to slot [${event.targetSlot}]`
  );
  if (!event.player)
    return;
  if (event.activeSlot === event.sourceSlot) {
    event.player.gear = invData[event.sourceSlot]?.baseGear;
  } else if (event.activeSlot === event.targetSlot) {
    event.player.gear = invData[event.targetSlot]?.baseGear;
  }
};

// runtime/worlds/dreamlab/survival/inventory/inventoryApp.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs3 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var isAttackAnimation = (currentAnimation) => {
  switch (currentAnimation) {
    case "greatsword":
    case "punch":
    case "bow":
    case "shoot":
      return true;
    default:
      return false;
  }
};
var InventoryApp = () => {
  const player = usePlayer();
  const [inventoryData, setInventoryData] = useState2(
    inventoryManager_default.getInstance().getInventoryData()
  );
  const [activeSlot, setActiveSlot] = useState2(0);
  const [isInventoryOpen, setIsInventoryOpen] = useState2(false);
  const [sourceSlot, setSourceSlot] = useState2(null);
  const commonEventProps = {
    inventoryData,
    activeSlot
  };
  const onInventoryOpen = useCallback(
    (pressed) => {
      if (!pressed)
        return;
      setIsInventoryOpen((prev) => !prev);
    },
    [setIsInventoryOpen]
  );
  const onInventoryDigits = useCallback(
    (digit, pressed) => {
      if (!pressed || !player)
        return;
      if (isAttackAnimation(player.currentAnimation))
        return;
      const idx = digit - 1;
      setActiveSlot(idx);
      player.gear = inventoryData[idx]?.baseGear;
    },
    [player, inventoryData, setActiveSlot]
  );
  useEffect(() => {
    const updateInventory = () => {
      const invData = inventoryManager_default.getInstance().getInventoryData();
      setInventoryData([...invData]);
      if (player)
        player.gear = invData[activeSlot]?.baseGear;
    };
    events.addListener("onInventoryUpdate", updateInventory);
    return () => {
      events.removeListener("onInventoryUpdate", updateInventory);
    };
  }, [activeSlot, inventoryData, player]);
  useInput("@inventory/open", onInventoryOpen);
  for (let index = 0; index <= 9; index++) {
    useInput(
      `@inventory/digit${index}`,
      (va) => onInventoryDigits(index, va)
    );
  }
  const handleClick = (slotIndex) => {
    const event = {
      ...commonEventProps,
      cursorSlot: slotIndex
    };
    handleInventoryClick(event);
  };
  const handleDragStartEvent = (slotIndex) => {
    const event = {
      ...commonEventProps,
      cursorSlot: slotIndex,
      setSourceSlot
    };
    handleInventoryDragStart(event);
  };
  const handleDragEndEvent = (slotIndex) => {
    if (sourceSlot === null || !player)
      return;
    if (sourceSlot === slotIndex) {
      setSourceSlot(null);
      return;
    }
    inventoryManager_default.getInstance().swapItems(sourceSlot, slotIndex);
    setInventoryData([...inventoryManager_default.getInstance().getInventoryData()]);
    const event = {
      ...commonEventProps,
      player,
      cursorSlot: slotIndex,
      sourceSlot,
      targetSlot: slotIndex
    };
    handleInventoryDragEnd(event);
    setSourceSlot(null);
  };
  return /* @__PURE__ */ jsx4(Fragment, { children: !player ? /* @__PURE__ */ jsx4("div", { children: "Loading..." }) : /* @__PURE__ */ jsxs3(Fragment, { children: [
    /* @__PURE__ */ jsx4(
      inventoryHotbar_default,
      {
        activeSlot,
        inventoryData
      }
    ),
    isInventoryOpen && /* @__PURE__ */ jsx4(
      inventory_default,
      {
        data: inventoryData,
        onClick: handleClick,
        onDragEnd: handleDragEndEvent,
        onDragStart: handleDragStartEvent
      }
    )
  ] }) });
};

// runtime/worlds/dreamlab/survival/ui/gameScreen.tsx
import { useEffect as useEffect2, useState as useState4 } from "https://esm.sh/react@18.2.0";

// runtime/worlds/dreamlab/survival/playerDataManager.ts
var MAX_HEALTH = 10;
var INITIAL_SCORE = 0;
var INITIAL_GOLD = 500;
var PlayerManager = class _PlayerManager {
  static instance;
  health;
  score;
  gold;
  constructor() {
    this.health = MAX_HEALTH;
    this.score = INITIAL_SCORE;
    this.gold = INITIAL_GOLD;
  }
  static getInstance() {
    if (!_PlayerManager.instance) {
      _PlayerManager.instance = new _PlayerManager();
    }
    return _PlayerManager.instance;
  }
  // Health
  getHealth() {
    return this.health;
  }
  getMaxHealth() {
    return MAX_HEALTH;
  }
  setHealth(amount) {
    this.health = Math.min(MAX_HEALTH, Math.max(0, amount));
  }
  addHealth(amount) {
    this.health = Math.min(MAX_HEALTH, this.health + amount);
  }
  removeHealth(amount) {
    this.health = Math.max(0, this.health - amount);
  }
  // Score
  getScore() {
    return this.score;
  }
  setScore(amount) {
    this.score = Math.max(0, amount);
  }
  addScore(amount) {
    this.score += amount;
  }
  removeScore(amount) {
    this.score = Math.max(0, this.score - amount);
  }
  // Gold
  getGold() {
    return this.gold;
  }
  setGold(amount) {
    this.gold = Math.max(0, amount);
    events.emit("onGoldUpdate");
  }
  addGold(amount) {
    this.gold += amount;
    events.emit("onGoldUpdate");
  }
  removeGold(amount) {
    this.gold = Math.max(0, this.gold - amount);
    events.emit("onGoldUpdate");
  }
};
var playerDataManager_default = PlayerManager;

// runtime/worlds/dreamlab/survival/ui/deathScreen.tsx
import { useState as useState3 } from "https://esm.sh/react@18.2.0";

// runtime/worlds/dreamlab/survival/ui/styles.ts
var styles = {
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
    backgroundImage: 'url("https://s3-assets.dreamlab.gg/uploaded-from-editor/background-1702293365691.jpg")',
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
    zIndex: 1e3
  }
};

// runtime/worlds/dreamlab/survival/ui/deathScreen.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var DeathScreen = ({ score, onStartOver }) => {
  const [hovered, setHovered] = useState3(false);
  const [active, setActive] = useState3(false);
  const getButtonStyles = () => {
    const style = { ...styles.button };
    if (active) {
      style.transform = "scale(0.95)";
    }
    if (hovered) {
      style.transform = "scale(1.1)";
      style.boxShadow = "0 0 15px #9d9d9d";
    }
    return style;
  };
  return /* @__PURE__ */ jsxs4("div", { style: styles.container, children: [
    /* @__PURE__ */ jsx5("div", { style: styles.dealthOverlay }),
    /* @__PURE__ */ jsxs4("div", { style: styles.content, children: [
      /* @__PURE__ */ jsx5("div", { style: styles.title, children: "You Died" }),
      /* @__PURE__ */ jsxs4("div", { style: { ...styles.scoreContainer, marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsx5("span", { style: styles.gameScreenLabel, children: "Score:" }),
        /* @__PURE__ */ jsx5("span", { style: styles.score, children: score })
      ] }),
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: onStartOver,
          onMouseDown: () => setActive(true),
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => {
            setHovered(false);
            setActive(false);
          },
          onMouseUp: () => setActive(false),
          style: getButtonStyles(),
          type: "button",
          children: "Play Again"
        }
      )
    ] })
  ] });
};

// runtime/worlds/dreamlab/survival/ui/gameScreen.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var GameScreen = ({ game: game7, player }) => {
  const playerManager = playerDataManager_default.getInstance();
  const [score, setScore] = useState4(playerManager.getScore());
  const [gold, setGold] = useState4(playerManager.getGold());
  const [health, setHealth] = useState4(playerManager.getHealth());
  const [showDamage, setShowDamage] = useState4(false);
  useEffect2(() => {
    const scoreListener = (newScore) => {
      playerManager.addScore(newScore);
      setScore(playerManager.getScore());
      const goldToAdd = Math.floor(Math.random() * (newScore / 2));
      playerManager.addGold(goldToAdd);
      setGold(playerManager.getGold());
    };
    const goldListener = () => {
      setGold(playerManager.getGold());
    };
    const healthListener = (healthChange, isHealing = false) => {
      if (isHealing)
        playerManager.addHealth(healthChange);
      else
        playerManager.removeHealth(healthChange);
      setHealth(playerManager.getHealth());
      setShowDamage(true);
      setTimeout(() => setShowDamage(false), 300);
    };
    const damageListener = (healthChange) => healthListener(healthChange);
    const healListener = (healthChange) => healthListener(healthChange, true);
    events.addListener("onPlayerScore", scoreListener);
    events.addListener("onPlayerDamage", damageListener);
    events.addListener("onPlayerHeal", healListener);
    events.addListener("onGoldUpdate", goldListener);
    return () => {
      events.removeListener("onPlayerScore", scoreListener);
      events.removeListener("onPlayerDamage", damageListener);
      events.removeListener("onPlayerHeal", healListener);
      events.removeListener("onGoldUpdate", goldListener);
    };
  }, [playerManager]);
  const handleStartOver = async () => {
    playerManager.setHealth(playerManager.getMaxHealth());
    setHealth(playerManager.getHealth());
    player.teleport({ x: 0, y: 500 }, true);
  };
  return /* @__PURE__ */ jsxs5(Fragment2, { children: [
    showDamage && /* @__PURE__ */ jsx6("div", { style: { ...styles.damageOverlay, opacity: showDamage ? 1 : 0 } }),
    health <= 0 ? /* @__PURE__ */ jsx6(DeathScreen, { game: game7, onStartOver: handleStartOver, score }) : /* @__PURE__ */ jsxs5(Fragment2, { children: [
      /* @__PURE__ */ jsx6("div", { style: styles.healthContainer, children: Array.from({ length: playerManager.getMaxHealth() }).map(
        (_, index) => /* @__PURE__ */ jsx6(
          "span",
          {
            style: {
              ...styles.heartIcon,
              opacity: index < health ? 1 : 0.3
            },
            children: "\u2764\uFE0F"
          },
          `heart-${playerManager.getMaxHealth() - index}`
        )
      ) }),
      /* @__PURE__ */ jsxs5("div", { style: styles.gameScreenContainer, children: [
        /* @__PURE__ */ jsxs5("div", { style: styles.scoreContainer, children: [
          /* @__PURE__ */ jsx6("span", { style: styles.gameScreenLabel, children: "Score:" }),
          /* @__PURE__ */ jsx6("span", { style: styles.score, children: score })
        ] }),
        /* @__PURE__ */ jsxs5("div", { style: styles.scoreContainer, children: [
          /* @__PURE__ */ jsx6("span", { style: styles.gameScreenLabel, children: "\u{1FA99}" }),
          /* @__PURE__ */ jsx6("span", { style: styles.score, children: gold })
        ] })
      ] })
    ] })
  ] });
};

// runtime/worlds/dreamlab/survival/ui/itemPopup.tsx
import { usePlayer as usePlayer2 } from "@dreamlab.gg/ui/dist/react";
import { useEffect as useEffect3, useRef, useState as useState5 } from "https://esm.sh/react@18.2.0";
import { jsx as jsx7, jsxs as jsxs6 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var ItemScreen = ({ game: game7, item }) => {
  const player = usePlayer2();
  const [purchaseComplete, setPurchaseComplete] = useState5(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState5(false);
  const [prompt, setPrompt] = useState5("");
  const [currentItem, setCurrentItem] = useState5(
    item
  );
  const itemRef = useRef(item);
  const playerManager = playerDataManager_default.getInstance();
  const inventoryManager = inventoryManager_default.getInstance();
  useEffect3(() => {
    const itemListener = (_player, newItem) => {
      itemRef.current = newItem;
      setCurrentItem(newItem);
      setPurchaseComplete(false);
      setAwaitingConfirmation(false);
      setPrompt(
        `Press F to buy ${newItem?.baseGear?.displayName} for ${newItem?.value}\u{1FA99}`
      );
    };
    const itemConfirmListener = (keyDown) => {
      if (!keyDown) {
        return;
      }
      const itemToPickup = itemRef.current;
      if (itemToPickup) {
        if (itemToPickup.value && itemToPickup.value > 0 && !awaitingConfirmation && !purchaseComplete) {
          setPrompt(
            `Confirm purchase of ${itemToPickup.baseGear?.displayName} for ${itemToPickup.value}\u{1FA99}? Press F again to confirm.`
          );
          setAwaitingConfirmation(true);
        } else if (itemToPickup.value && itemToPickup.value > 0 && awaitingConfirmation && !purchaseComplete) {
          setPurchaseComplete(true);
          if (playerManager.getGold() >= itemToPickup.value) {
            playerManager.removeGold(itemToPickup.value);
            inventoryManager.addItemToInventory(itemToPickup);
            setPrompt("Item Purchased!");
          } else {
            setPrompt("Not enough \u{1FA99}.");
          }
          setAwaitingConfirmation(false);
        } else {
          if (!purchaseComplete)
            inventoryManager.addItemToInventory(itemToPickup);
          setPrompt("Item Purchased!");
        }
      }
    };
    events.addListener("onPlayerNearItem", itemListener);
    game7.client.inputs.addListener("@survival/pickup", itemConfirmListener);
    return () => {
      events.removeListener("onPlayerNearItem", itemListener);
      game7.client.inputs.removeListener(
        "@survival/pickup",
        itemConfirmListener
      );
    };
  }, [
    game7.client.inputs,
    player,
    playerManager,
    inventoryManager,
    awaitingConfirmation,
    purchaseComplete
  ]);
  if (!currentItem)
    return null;
  const overlayStyle = styles.pickupOverlay;
  const promptMessage = prompt;
  return /* @__PURE__ */ jsx7("div", { style: overlayStyle, children: /* @__PURE__ */ jsxs6("div", { style: styles.itemInfo, children: [
    /* @__PURE__ */ jsx7("span", { style: styles.itemName, children: currentItem.baseGear?.displayName }),
    /* @__PURE__ */ jsxs6("div", { style: styles.statsSection, children: [
      /* @__PURE__ */ jsx7("span", { style: styles.statName, children: "Stats:" }),
      /* @__PURE__ */ jsxs6("span", { style: styles.statValue, children: [
        "Damage: ",
        currentItem.damage
      ] }),
      currentItem.baseGear.animationName === "greatsword" && /* @__PURE__ */ jsxs6("span", { style: styles.statValue, children: [
        "Range: ",
        currentItem.range
      ] })
    ] }),
    /* @__PURE__ */ jsx7("span", { style: styles.loreSection, children: currentItem.lore }),
    /* @__PURE__ */ jsx7("span", { style: styles.pickupPrompt, children: promptMessage })
  ] }) });
};

// runtime/worlds/dreamlab/survival/ui/startScreen.tsx
import { Fragment as Fragment3, jsx as jsx8, jsxs as jsxs7 } from "https://esm.sh/react@18.2.0/jsx-runtime";
var StartScreen = () => {
  const game7 = useGame();
  const player = usePlayer3();
  const [hovered, setHovered] = useState6(false);
  const [active, setActive] = useState6(false);
  const [gameStarted, setGameStarted] = useState6(false);
  const handlePlayClick = async () => {
    setGameStarted(true);
  };
  const getButtonStyles = (hover, active2) => {
    const style = { ...styles.button };
    if (active2) {
      style.transform = "translateY(2px)";
      style.boxShadow = "1px 1px 0px #7f462c";
    }
    if (hover) {
      style.backgroundColor = "#a52a2a";
      style.color = "#ffffff";
      style.borderColor = "#7f0000";
      style.boxShadow = "0 0 10px 3px #ff0000";
      style.textShadow = "0 0 5px #ff0000, 0 0 10px #ff0000";
    }
    return style;
  };
  if (player && gameStarted) {
    return /* @__PURE__ */ jsx8(GameScreen, { game: game7, player });
  }
  return /* @__PURE__ */ jsxs7("div", { style: styles.container, children: [
    /* @__PURE__ */ jsx8("div", { style: styles.backgroundAnimation }),
    /* @__PURE__ */ jsx8("div", { style: styles.content, children: !player ? /* @__PURE__ */ jsx8("div", { style: getButtonStyles(hovered, active), children: "Loading..." }) : /* @__PURE__ */ jsx8(
      "button",
      {
        onClick: handlePlayClick,
        onMouseDown: () => setActive(true),
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => {
          setHovered(false);
          setActive(false);
        },
        onMouseUp: () => setActive(false),
        style: getButtonStyles(hovered, active),
        type: "button",
        children: "Play"
      }
    ) }),
    /* @__PURE__ */ jsx8("div", { style: styles.versionLabel, children: "Alpha Version" })
  ] });
};
var initializeUI = (game7) => {
  const registerInput = (input, name, defaultKey) => game7.client?.inputs.registerInput(input, name, defaultKey);
  const digits = Array.from({ length: 9 }, (_, index) => "digit" + (index + 1));
  const keys = [
    "KeyE",
    ...Array.from(
      { length: 9 },
      (_, index) => `Digit${index + 1}`
    )
  ];
  const inputNames = [
    "Open Inventory",
    ...digits.map((digit) => `Select ${digit}`)
  ];
  for (const [index, input] of ["open", ...digits].entries()) {
    const key = keys[index];
    const name = inputNames[index];
    if (key && name) {
      registerInput(`@inventory/${input}`, name, key);
    }
  }
  registerInput("@survival/pickup", "Item Pickup", "KeyF");
  renderUI(
    game7,
    /* @__PURE__ */ jsxs7(Fragment3, { children: [
      /* @__PURE__ */ jsx8(StartScreen, {}),
      /* @__PURE__ */ jsx8(InventoryApp, {}),
      /* @__PURE__ */ jsx8(ItemScreen, { game: game7, item: void 0 })
    ] })
  );
};

// runtime/worlds/dreamlab/survival/client.ts
var init = async (game7) => {
  await preloadAssets();
  initializeUI(game7);
  deferUntilPlayer(async (player) => {
    const spawnpoints = game7.queryTags("any", ["spawnpoint"]);
    if (spawnpoints.length > 0) {
      const spawn = spawnpoints[Math.floor(Math.random() * spawnpoints.length)];
      if (spawn)
        player.teleport(spawn.transform.position, true);
    }
    player.characterId = "c_y9ydqx2pghxl04emgnxu6r5g";
  });
  await sharedInit(game7);
};
export {
  init
};
//# sourceMappingURL=client.bundled.js.map
