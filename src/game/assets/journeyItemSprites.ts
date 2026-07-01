// Sprites de objetos clave del viaje.
// Los PNG tienen lienzo transparente grande, por eso ajustamos escala y offset aqui.
import Phaser from "phaser";

export type JourneyItemSpriteConfig = {
  key: string;
  url: string;
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const JOURNEY_ITEM_SPRITES = {
  weight: {
    key: "journey-item-weight",
    url: "/assets/game/items/pesa.png",
    scale: 0.18,
    offsetX: 0,
    offsetY: 14,
  },
  float: {
    key: "journey-item-float",
    url: "/assets/game/items/flotador.png",
    scale: 0.2,
    offsetX: 0,
    offsetY: 7,
  },
  box: {
    key: "journey-item-box",
    url: "/assets/game/items/caja.png",
    scale: 0.22,
    offsetX: 0,
    offsetY: 8,
  },
  notebook: {
    key: "journey-item-notebook",
    url: "/assets/game/items/libreta.png",
    scale: 0.215,
    offsetX: 0,
    offsetY: 10,
  },
  laptop: {
    key: "journey-item-laptop",
    url: "/assets/game/items/portatil.png",
    scale: 0.32,
    offsetX: 0,
    offsetY: 0,
  },
  block: {
    key: "journey-item-block",
    url: "/assets/game/items/bloque.png",
    scale: 0.5,
    offsetX: 0,
    offsetY: -16,
  },
  portal: {
    key: "journey-item-portal",
    url: "/assets/game/items/tuberia.png",
    scale: 0.32,
    offsetX: 0,
    offsetY: -37,
  },
} as const;

export function preloadJourneyItemSprites(scene: Phaser.Scene) {
  for (const sprite of Object.values(JOURNEY_ITEM_SPRITES)) {
    if (!scene.textures.exists(sprite.key)) {
      scene.load.image(sprite.key, sprite.url);
    }
  }
}

export function addJourneyItemSprite(
  scene: Phaser.Scene,
  sprite: JourneyItemSpriteConfig,
  x: number,
  y: number,
  depth = 4,
): Phaser.GameObjects.Image {
  return scene.add
    .image(x + sprite.offsetX, y + sprite.offsetY, sprite.key)
    .setOrigin(0.5)
    .setScale(sprite.scale)
    .setDepth(depth);
}
