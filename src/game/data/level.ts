// Datos geometricos del primer tramo. La escena los convierte en objetos Phaser.
export const FIRST_JOURNEY_SECTION = {
  worldWidth: 5600,
  worldHeight: 900,
  groundHeight: 64,
  groundY: 868,
  playerStart: {
    x: 120,
    y: 814,
  },
  weight: {
    x: 600,
    y: 802,
  },
  block: {
    x: 850,
    y: 804,
    width: 200,
    height: 64,
  },
  gap: {
    startX: 1200,
    endX: 1520,
    centerX: 1360,
    width: 320,
  },
  sportDialogueTriggerX: 1600,
  float: {
    x: 1900,
    y: 802,
  },
  pool: {
    startX: 2100,
    endX: 2500,
    centerX: 2300,
    width: 400,
    waterY: 868,
    safeRespawn: {
      x: 1950,
      y: 814,
    },
  },
  lifeguardDialogueTriggerX: 2650,
  safeRespawn: {
    x: 1160,
    y: 814,
  },
  workStudy: {
    box: {
      x: 3000,
      y: 802,
    },
    notebook: {
      x: 3150,
      y: 802,
    },
    safeRespawn: {
      x: 3260,
      y: 814,
    },
    dialogueTriggerX: 4200,
    platforms: [
      { x: 3350, y: 760, width: 200, height: 28 },
      { x: 3550, y: 680, width: 200, height: 28 },
      { x: 3750, y: 600, width: 180, height: 28 },
      { x: 3920, y: 510, width: 180, height: 28 },
      { x: 4100, y: 420, width: 200, height: 28 },
      // Puente de transicion hacia la ultima zona.
      { x: 4350, y: 420, width: 300, height: 28 },
    ],
  },
  dev: {
    laptop: {
      x: 4350,
      y: 372,
    },
    safeRespawn: {
      x: 4300,
      y: 384,
    },
    finish: {
      x: 5480,
      y: 318,
    },
    platforms: [
      { x: 4620, y: 420, width: 260, height: 28 },
      { x: 4900, y: 390, width: 240, height: 28 },
      { x: 5180, y: 360, width: 260, height: 28 },
      { x: 5460, y: 360, width: 260, height: 28 },
    ],
  },
  groundSegments: [
    { x: 600, y: 868, width: 1200, height: 64 },
    { x: 1810, y: 868, width: 580, height: 64 },
    { x: 2975, y: 868, width: 950, height: 64 },
  ],
} as const;
