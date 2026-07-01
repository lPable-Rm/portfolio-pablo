// Feedback visual corto al recoger objetos y desbloquear habilidades.
import Phaser from "phaser";

type PickupFeedbackOptions = {
  label: string;
  sparkColor: number;
  playerSprite: Phaser.GameObjects.Sprite;
  visuals: Phaser.GameObjects.GameObject[];
};

const FLOAT_TEXT_OFFSET_X = 28;
const FLOAT_TEXT_OFFSET_Y = -50;
const FLOAT_TEXT_COLOR = "#42f8ff";

export function playPickupFeedback(
  scene: Phaser.Scene,
  player: Phaser.GameObjects.Rectangle,
  options: PickupFeedbackOptions,
) {
  animateCollectedVisuals(scene, options.visuals);
  pulsePlayerSprite(scene, options.playerSprite);
  createSparkBurst(scene, player, options.sparkColor);

  const text = scene.add
    .text(
      player.x + FLOAT_TEXT_OFFSET_X,
      player.y + FLOAT_TEXT_OFFSET_Y,
      `+1 ${options.label}`,
      {
        color: FLOAT_TEXT_COLOR,
        fontFamily: "monospace",
        fontSize: "13px",
        fontStyle: "bold",
      },
    )
    .setOrigin(0, 0.5)
    .setDepth(30);

  text.setShadow(0, 0, FLOAT_TEXT_COLOR, 8, true, true);

  scene.tweens.add({
    targets: text,
    y: text.y - 38,
    alpha: 0,
    scaleX: 1.12,
    scaleY: 1.12,
    duration: 1200,
    ease: "Cubic.easeOut",
    onComplete: () => text.destroy(),
  });
}

function animateCollectedVisuals(
  scene: Phaser.Scene,
  visuals: Phaser.GameObjects.GameObject[],
) {
  if (visuals.length === 0) {
    return;
  }

  scene.tweens.add({
    targets: visuals,
    y: "-=20",
    alpha: 0,
    scaleX: "*=1.12",
    scaleY: "*=1.12",
    duration: 260,
    ease: "Back.easeIn",
    onComplete: () => {
      visuals.forEach((visual) => visual.destroy());
    },
  });
}

function pulsePlayerSprite(
  scene: Phaser.Scene,
  playerSprite: Phaser.GameObjects.Sprite,
) {
  const startScaleX = playerSprite.scaleX;
  const startScaleY = playerSprite.scaleY;

  scene.tweens.add({
    targets: playerSprite,
    scaleX: startScaleX * 1.08,
    scaleY: startScaleY * 1.08,
    duration: 110,
    ease: "Sine.easeOut",
    yoyo: true,
    onComplete: () => playerSprite.setScale(startScaleX, startScaleY),
  });
}

function createSparkBurst(
  scene: Phaser.Scene,
  player: Phaser.GameObjects.Rectangle,
  color: number,
) {
  const originX = player.x + 22;
  const originY = player.y - 30;
  const angles = [-64, -24, 18, 54];

  for (const angle of angles) {
    const spark = scene.add
      .rectangle(originX, originY, 4, 4, color, 0.95)
      .setAngle(45)
      .setDepth(29);
    const radians = Phaser.Math.DegToRad(angle);
    const distance = 22;

    scene.tweens.add({
      targets: spark,
      x: originX + Math.cos(radians) * distance,
      y: originY + Math.sin(radians) * distance,
      alpha: 0,
      duration: 360,
      ease: "Cubic.easeOut",
      onComplete: () => spark.destroy(),
    });
  }
}
