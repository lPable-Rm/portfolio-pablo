// Helpers para construir partes visuales/estaticas del nivel.
import Phaser from "phaser";
import { JOURNEY_BACKGROUNDS } from "../assets/journeyBackgrounds";
import {
  JOURNEY_GROUND_SPRITE,
  JOURNEY_PLATFORM_SPRITE,
  JOURNEY_POOL_SPRITE,
} from "../assets/journeyEnvironmentSprites";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

type PlatformList = Phaser.GameObjects.Rectangle[];

const BACKGROUND_DISTANCE_SCALE = 0.96;
const BACKGROUND_SCROLL_FACTOR_X = 0.82;
const GROUND_SPRITE_DISPLAY_HEIGHT = 132;
const GROUND_SPRITE_WIDTH_PAD = 28;
const GROUND_SPRITE_Y_OFFSET = -16;
const PLATFORM_SPRITE_WIDTH_MULTIPLIER = 1.18;
const PLATFORM_SPRITE_DISPLAY_HEIGHT = 108;
const PLATFORM_SPRITE_Y_OFFSET = -8;
const POOL_DISPLAY_WIDTH_MULTIPLIER = 1.18;
const POOL_DISPLAY_HEIGHT = 126;
const POOL_Y_OFFSET = -18;
const POOL_WATER_WIDTH_MULTIPLIER = 0.72;
const POOL_WATER_HEIGHT = 34;
const POOL_WATER_Y_OFFSET = -20;

// Coloca los fondos nuevos como paneles del mundo para recuperar movimiento.
export function createJourneyBackgrounds(scene: Phaser.Scene) {
  const targetHeight =
    FIRST_JOURNEY_SECTION.worldHeight * BACKGROUND_DISTANCE_SCALE;
  const bottomY = FIRST_JOURNEY_SECTION.worldHeight;
  let x = 0;
  let index = 0;

  while (x < FIRST_JOURNEY_SECTION.worldWidth) {
    const background = JOURNEY_BACKGROUNDS[index % JOURNEY_BACKGROUNDS.length];
    const source = scene.textures.get(background.key).getSourceImage();
    const scale = targetHeight / source.height;
    const displayWidth = source.width * scale;

    // Origin abajo-izquierda: el horizonte queda estable respecto al suelo.
    scene.add
      .image(x, bottomY, background.key)
      .setOrigin(0, 1)
      .setScrollFactor(BACKGROUND_SCROLL_FACTOR_X, 1)
      .setDisplaySize(displayWidth, targetHeight)
      .setDepth(-30);

    x += displayWidth;
    index += 1;
  }
}

// Crea el suelo plano y los tramos alrededor de los huecos/piscina.
export function createGround(scene: ArcadeScene, platforms: PlatformList) {
  for (const segment of FIRST_JOURNEY_SECTION.groundSegments) {
    // La fisica se mantiene igual que antes; el sprite es solo decorativo.
    const platform = scene.add.rectangle(
      segment.x,
      segment.y,
      segment.width,
      segment.height,
      0xffffff,
      0,
    );

    scene.physics.add.existing(platform, true);
    platforms.push(platform);

    scene.add
      .image(
        segment.x,
        segment.y + GROUND_SPRITE_Y_OFFSET,
        JOURNEY_GROUND_SPRITE.key,
      )
      .setOrigin(0.5)
      .setDisplaySize(
        segment.width + GROUND_SPRITE_WIDTH_PAD,
        GROUND_SPRITE_DISPLAY_HEIGHT,
      )
      .setDepth(2);
  }

  // El hueco se entiende por la geometria del nivel, sin rotulos visibles.
}

// Escalera ascendente que representa el esfuerzo de trabajar y estudiar.
export function createWorkStudyPlatforms(
  scene: ArcadeScene,
  platforms: PlatformList,
) {
  for (const platformData of FIRST_JOURNEY_SECTION.workStudy.platforms) {
    // La colision sigue siendo un rectangulo limpio; el sprite solo viste la plataforma.
    const platform = scene.add.rectangle(
      platformData.x,
      platformData.y,
      platformData.width,
      platformData.height,
      0xffffff,
      0,
    );

    scene.physics.add.existing(platform, true);
    platforms.push(platform);

    scene.add
      .image(
        platformData.x,
        platformData.y + PLATFORM_SPRITE_Y_OFFSET,
        JOURNEY_PLATFORM_SPRITE.key,
      )
      .setOrigin(0.5)
      .setDisplaySize(
        platformData.width * PLATFORM_SPRITE_WIDTH_MULTIPLIER,
        PLATFORM_SPRITE_DISPLAY_HEIGHT,
      )
      .setDepth(3);
  }
}

// Plataformas finales de la etapa Dev.
export function createDevPlatforms(scene: ArcadeScene, platforms: PlatformList) {
  for (const platformData of FIRST_JOURNEY_SECTION.dev.platforms) {
    // La colision queda independiente para ajustar el arte sin romper el salto.
    const platform = scene.add.rectangle(
      platformData.x,
      platformData.y,
      platformData.width,
      platformData.height,
      0xffffff,
      0,
    );

    scene.physics.add.existing(platform, true);
    platforms.push(platform);

    scene.add
      .image(
        platformData.x,
        platformData.y + PLATFORM_SPRITE_Y_OFFSET,
        JOURNEY_PLATFORM_SPRITE.key,
      )
      .setOrigin(0.5)
      .setDisplaySize(
        platformData.width * PLATFORM_SPRITE_WIDTH_MULTIPLIER,
        PLATFORM_SPRITE_DISPLAY_HEIGHT,
      )
      .setDepth(3);
  }
}

// Piscina visual. Solo gana una plataforma fisica tras recoger el flotador.
export function createPool(scene: Phaser.Scene) {
  const { centerX, waterY, width } = FIRST_JOURNEY_SECTION.pool;
  const displayWidth = width * POOL_DISPLAY_WIDTH_MULTIPLIER;
  const poolY = waterY + POOL_Y_OFFSET;

  // El sprite queda hundido respecto al suelo; la fisica sigue en su sitio.
  scene.add
    .image(centerX, poolY, JOURNEY_POOL_SPRITE.key)
    .setOrigin(0.5)
    .setDisplaySize(displayWidth, POOL_DISPLAY_HEIGHT)
    .setDepth(1);

  const waterWidth = displayWidth * POOL_WATER_WIDTH_MULTIPLIER;
  const surfaceY = poolY + POOL_WATER_Y_OFFSET;
  const surface = scene.add
    .rectangle(centerX, surfaceY, waterWidth, POOL_WATER_HEIGHT, 0x42f8ff, 0.18)
    .setDepth(6);

  // La lamina superior ayuda a que Pablito parezca entrar dentro del agua.
  scene.tweens.add({
    targets: surface,
    alpha: { from: 0.16, to: 0.3 },
    y: surfaceY + 2,
    duration: 1200,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });
}
