// Portal/meta final del tramo jugable.
import Phaser from "phaser";
import {
  addJourneyItemSprite,
  JOURNEY_ITEM_SPRITES,
} from "../assets/journeyItemSprites";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

export type FinishPortalEntity = {
  zone: Phaser.GameObjects.Rectangle;
  visual: Phaser.GameObjects.Image;
};

export function createFinishPortal(
  scene: ArcadeScene,
  player: Phaser.GameObjects.Rectangle,
  onFinish: () => void,
): FinishPortalEntity {
  const { x, y } = FIRST_JOURNEY_SECTION.dev.finish;

  const visual = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.portal,
    x,
    y,
    7,
  );

  // Zona invisible: solo la boca superior activa la entrada tipo tuberia.
  const finishZone = scene.add.rectangle(x, y - 92, 58, 28, 0xffffff, 0);
  scene.physics.add.existing(finishZone, true);
  scene.physics.add.overlap(player, finishZone, onFinish);

  return {
    zone: finishZone,
    visual,
  };
}
