// Efectos visuales temporales de power-up.
// Cuando lleguen los sprites finales, estos helpers seran el punto de cambio.
import Phaser from "phaser";

type PlaceholderPlayer = Phaser.GameObjects.Rectangle;

export function playWeightPowerPlaceholder(
  scene: Phaser.Scene,
  player: PlaceholderPlayer,
) {
  player.setFillStyle(0xff4fd8);
  player.setStrokeStyle(2, 0xffe66d, 0.95);
  scene.tweens.add({
    targets: player,
    scaleX: 1.28,
    scaleY: 1.2,
    duration: 160,
    yoyo: true,
    repeat: 1,
    onComplete: () => player.setScale(1.12, 1.08),
  });
}

export function createFloatAuraPlaceholder(
  scene: Phaser.Scene,
  player: PlaceholderPlayer,
): Phaser.GameObjects.Graphics {
  const aura = scene.add.graphics();
  player.setStrokeStyle(2, 0x42f8ff, 1);

  return aura;
}

export function playWorkStudyPowerPlaceholder(
  scene: Phaser.Scene,
  player: PlaceholderPlayer,
) {
  player.setFillStyle(0xffb45b);
  player.setStrokeStyle(2, 0xffe66d, 1);
  scene.tweens.add({
    targets: player,
    scaleX: 1.24,
    scaleY: 1.16,
    duration: 160,
    yoyo: true,
    repeat: 1,
    onComplete: () => player.setScale(1.16, 1.1),
  });
}

export function playPabloDevPowerPlaceholder(
  scene: Phaser.Scene,
  player: PlaceholderPlayer,
) {
  player.setFillStyle(0xf6f7ff);
  player.setStrokeStyle(3, 0x42f8ff, 1);
  scene.tweens.add({
    targets: player,
    scaleX: 1.32,
    scaleY: 1.22,
    duration: 170,
    yoyo: true,
    repeat: 2,
    onComplete: () => player.setScale(1.18, 1.1),
  });
}
