// Helpers para construir partes visuales/estaticas del nivel.
import Phaser from "phaser";
import { JOURNEY_BACKGROUNDS } from "../assets/journeyBackgrounds";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

type PlatformList = Phaser.GameObjects.Rectangle[];

const BACKGROUND_DISTANCE_SCALE = 0.96;
const BACKGROUND_SCROLL_FACTOR_X = 0.82;

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

// Fondo provisional de estrellas sobre el mundo entero.
export function createStars(scene: Phaser.Scene) {
  for (let index = 0; index < 70; index += 1) {
    const size = Phaser.Math.Between(1, 3);

    scene.add
      .rectangle(
        Phaser.Math.Between(0, FIRST_JOURNEY_SECTION.worldWidth),
        Phaser.Math.Between(
          24,
          FIRST_JOURNEY_SECTION.worldHeight -
            FIRST_JOURNEY_SECTION.groundHeight -
            24,
        ),
        size,
        size,
        0x8feeff,
      )
      .setAlpha(Phaser.Math.FloatBetween(0.35, 0.9));
  }
}

// Crea el suelo plano y los tramos alrededor de los huecos/piscina.
export function createGround(scene: ArcadeScene, platforms: PlatformList) {
  for (const segment of FIRST_JOURNEY_SECTION.groundSegments) {
    const platform = scene.add.rectangle(
      segment.x,
      segment.y,
      segment.width,
      segment.height,
      0x152238,
    );

    platform.setStrokeStyle(2, 0x42f8ff, 0.55);
    scene.physics.add.existing(platform, true);
    platforms.push(platform);
  }

  // El hueco se entiende por la geometria del nivel, sin rotulos visibles.
}

// Escalera ascendente que representa el esfuerzo de trabajar y estudiar.
export function createWorkStudyPlatforms(
  scene: ArcadeScene,
  platforms: PlatformList,
) {
  for (const platformData of FIRST_JOURNEY_SECTION.workStudy.platforms) {
    const platform = scene.add.rectangle(
      platformData.x,
      platformData.y,
      platformData.width,
      platformData.height,
      0x5a3c2d,
    );

    platform.setStrokeStyle(2, 0xffb45b, 0.9);
    scene.physics.add.existing(platform, true);
    platforms.push(platform);
  }
}

// Plataformas finales con color mas tecnologico: placeholder de la etapa Dev.
export function createDevPlatforms(scene: ArcadeScene, platforms: PlatformList) {
  for (const platformData of FIRST_JOURNEY_SECTION.dev.platforms) {
    const platform = scene.add.rectangle(
      platformData.x,
      platformData.y,
      platformData.width,
      platformData.height,
      0x11234a,
    );

    platform.setStrokeStyle(2, 0x42f8ff, 0.9);
    scene.physics.add.existing(platform, true);
    platforms.push(platform);

    scene.add.rectangle(
      platformData.x,
      platformData.y - 2,
      platformData.width - 24,
      3,
      0xff4fd8,
      0.35,
    );
  }
}

// Piscina visual. Solo gana una plataforma fisica tras recoger el flotador.
export function createPool(scene: Phaser.Scene) {
  const { centerX, waterY, width } = FIRST_JOURNEY_SECTION.pool;
  const water = scene.add.rectangle(
    centerX,
    waterY,
    width,
    FIRST_JOURNEY_SECTION.groundHeight,
    0x168fd0,
    0.66,
  );
  water.setStrokeStyle(2, 0x42f8ff, 0.9);
}
