// Sprites de entorno del nivel jugable.
import Phaser from "phaser";

export const JOURNEY_POOL_SPRITE = {
  key: "journey-environment-pool",
  url: "/assets/game/items/piscina.png",
} as const;

export const JOURNEY_GROUND_SPRITE = {
  key: "journey-environment-ground",
  url: "/assets/game/items/suelocentral.png",
} as const;

export function preloadJourneyEnvironmentSprites(scene: Phaser.Scene) {
  if (!scene.textures.exists(JOURNEY_POOL_SPRITE.key)) {
    scene.load.image(JOURNEY_POOL_SPRITE.key, JOURNEY_POOL_SPRITE.url);
  }

  if (!scene.textures.exists(JOURNEY_GROUND_SPRITE.key)) {
    scene.load.image(JOURNEY_GROUND_SPRITE.key, JOURNEY_GROUND_SPRITE.url);
  }
}
