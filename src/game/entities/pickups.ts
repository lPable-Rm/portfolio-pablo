// Pickups del viaje: sprite visual + hitbox invisible de recogida.
import Phaser from "phaser";
import {
  addJourneyItemSprite,
  JOURNEY_ITEM_SPRITES,
} from "../assets/journeyItemSprites";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

type PlayerBodyObject = Phaser.GameObjects.Rectangle;

export type PickupResult = {
  pickup: Phaser.GameObjects.Rectangle;
  visuals: Phaser.GameObjects.GameObject[];
};

export type WorkStudyPickups = {
  boxPickup: Phaser.GameObjects.Rectangle;
  boxVisuals: Phaser.GameObjects.GameObject[];
  notebookPickup: Phaser.GameObjects.Rectangle;
  notebookVisuals: Phaser.GameObjects.GameObject[];
};

export function createWeightPickup(
  scene: ArcadeScene,
  player: PlayerBodyObject,
  onCollect: () => void,
): PickupResult {
  const { x, y } = FIRST_JOURNEY_SECTION.weight;
  const weightSprite = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.weight,
    x,
    y,
  );

  // La hitbox conserva el tamano del prototipo para no cambiar la recogida.
  const pickup = scene.add.rectangle(x, y, 42, 34, 0xffffff, 0);
  scene.physics.add.existing(pickup, true);
  scene.physics.add.overlap(player, pickup, onCollect);

  return {
    pickup,
    visuals: [weightSprite],
  };
}

export function createFloatPickup(
  scene: ArcadeScene,
  player: PlayerBodyObject,
  onCollect: () => void,
): PickupResult {
  const { x, y } = FIRST_JOURNEY_SECTION.float;
  const floatSprite = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.float,
    x,
    y,
  );

  // La zona invisible evita depender de la silueta irregular del sprite.
  const pickup = scene.add.rectangle(x, y, 44, 44, 0xffffff, 0);
  scene.physics.add.existing(pickup, true);
  scene.physics.add.overlap(player, pickup, onCollect);

  return {
    pickup,
    visuals: [floatSprite],
  };
}

export function createWorkStudyPickups(
  scene: ArcadeScene,
  player: PlayerBodyObject,
  onCollectBox: () => void,
  onCollectNotebook: () => void,
): WorkStudyPickups {
  const { box, notebook } = FIRST_JOURNEY_SECTION.workStudy;

  const boxSprite = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.box,
    box.x,
    box.y,
  );
  const boxPickup = scene.add.rectangle(box.x, box.y, 42, 34, 0xffffff, 0);
  scene.physics.add.existing(boxPickup, true);
  scene.physics.add.overlap(player, boxPickup, onCollectBox);

  const notebookSprite = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.notebook,
    notebook.x,
    notebook.y,
  );
  const notebookPickup = scene.add.rectangle(
    notebook.x,
    notebook.y,
    30,
    40,
    0xffffff,
    0,
  );
  scene.physics.add.existing(notebookPickup, true);
  scene.physics.add.overlap(player, notebookPickup, onCollectNotebook);

  return {
    boxPickup,
    boxVisuals: [boxSprite],
    notebookPickup,
    notebookVisuals: [notebookSprite],
  };
}

export function createLaptopPickup(
  scene: ArcadeScene,
  player: PlayerBodyObject,
  onCollect: () => void,
): PickupResult {
  const { x, y } = FIRST_JOURNEY_SECTION.dev.laptop;
  const laptopSprite = addJourneyItemSprite(
    scene,
    JOURNEY_ITEM_SPRITES.laptop,
    x,
    y,
  );

  // El rectangulo invisible sigue siendo el area real de recogida.
  const pickup = scene.add.rectangle(x, y, 70, 58, 0xffffff, 0);
  scene.physics.add.existing(pickup, true);
  scene.physics.add.overlap(player, pickup, onCollect);

  return {
    pickup,
    visuals: [laptopSprite],
  };
}
