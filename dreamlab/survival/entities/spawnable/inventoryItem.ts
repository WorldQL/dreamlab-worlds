import type { RenderTime, SpawnableContext } from "@dreamlab.gg/core";
import type { EventHandler } from "@dreamlab.gg/core/dist/events";
import {
  camera,
  debug,
  game,
  events as magicEvent,
} from "@dreamlab.gg/core/dist/labs";
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities";
import { createGear } from "@dreamlab.gg/core/managers";
import { Vec } from "@dreamlab.gg/core/math";
import { z } from "@dreamlab.gg/core/sdk";
import { events } from "../../events.ts";
import type { InventoryItem } from "../../inventory/inventoryManager.ts";

type Args = typeof ArgsSchema;
const ArgsSchema = SolidArgs.extend({
  displayName: z.string().default("Default Item"),
  animationName: z
    .enum(["bow", "shoot", "greatsword", "idle", "jump", "jog", "walk"])
    .default("shoot"),
  damage: z.number().default(1),
  range: z.number().default(1),
  lore: z.string().default("Default Item Lore"),
  bone: z.enum(["handLeft", "handRight"]).default("handRight"),
  anchorX: z.number().default(0.5),
  anchorY: z.number().default(0.5),
  rotation: z.number().default(0),
  speedMultiplier: z.number().optional().default(1),
});

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">;
type OnPlayerCollisionEnd = EventHandler<"onPlayerCollisionEnd">;

export { ArgsSchema as InventoryItemArgs };
export class Item<A extends Args = Args> extends Solid<A> {
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined;
  protected onPlayerCollisionEnd: OnPlayerCollisionEnd | undefined;

  private time = 0;
  private floatHeight = 5;
  private rotationSpeed = 0.006;

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx);

    this.body.isSensor = true;
    this.body.isStatic = true;
    this.body.label = "inventoryItem";

    const $game = game();

    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([player, other]) => {
        if (this.body && other === this.body && $game.client) {
          const baseGear = {
            displayName: this.args.displayName,
            textureURL: this.args.spriteSource?.url ?? "",
            animationName: this.args.animationName,
            anchor: { x: this.args.anchorX, y: this.args.anchorY },
            rotation: this.args.rotation,
            bone: this.args.bone,
            speedMultiplier: this.args.speedMultiplier,
          };

          const newItem = createGear(baseGear);

          const inventoryItem: InventoryItem = {
            baseGear: newItem,
            lore: this.args.lore,
            damage: this.args.damage,
            range: this.args.range,
            value: 100,
          };

          events.emit("onPlayerNearItem", player, inventoryItem);
        }
      })
    );

    magicEvent("client")?.on(
      "onPlayerCollisionEnd",
      (this.onPlayerCollisionEnd = ([player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPlayerNearItem", player, undefined);
        }
      })
    );
  }

  public override teardown(): void {
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

  public override onRenderFrame(_time: RenderTime) {
    // super.onRenderFrame(time)
    this.time += 0.05;

    const yOffset = Math.sin(this.time) * this.floatHeight;
    const pos = Vec.add(this.transform.position, camera().offset);
    pos.y += yOffset;

    this.container!.rotation += this.rotationSpeed;
    this.container!.position = pos;

    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0;
  }
}
