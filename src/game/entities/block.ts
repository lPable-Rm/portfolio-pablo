// Bloque empujable que aparece tras recoger la pesa.
import Phaser from "phaser";
import {
  addJourneyItemSprite,
  JOURNEY_ITEM_SPRITES,
} from "../assets/journeyItemSprites";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

export type PushBlockEntity = {
  block: Phaser.GameObjects.Rectangle;
  body: Phaser.Physics.Arcade.Body;
  visual: Phaser.GameObjects.Image;
};

export function createPushBlock(
  scene: ArcadeScene,
  player: Phaser.GameObjects.Rectangle,
  platforms: Phaser.GameObjects.Rectangle[],
): PushBlockEntity {
  const { x, y, width, height } = FIRST_JOURNEY_SECTION.block;

  // La hitbox invisible conserva el empuje estable del prototipo.
  const block = scene.add.rectangle(x, y, width, height, 0xffffff, 0);
  const visual = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.block,
    x,
    y,
    4,
  );

  scene.physics.add.existing(block);
  const body = block.body as Phaser.Physics.Arcade.Body;
  body.setCollideWorldBounds(true);
  body.setDragX(900);

  // El bloque necesita colisionar con el suelo y con el jugador que lo empuja.
  for (const platform of platforms) {
    scene.physics.add.collider(block, platform);
  }
  scene.physics.add.collider(player, block);

  return { block, body, visual };
}

export function syncPushBlockVisual(pushBlock: PushBlockEntity) {
  const sprite = JOURNEY_ITEM_SPRITES.block;
  const { block, visual } = pushBlock;

  // El sprite sigue al rectangulo fisico que Arcade mueve al empujarlo.
  visual.setPosition(block.x + sprite.offsetX, block.y + sprite.offsetY);
}
