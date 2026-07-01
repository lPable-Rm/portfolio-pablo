// Reglas de respawn del tramo jugable.
// Mantienen la escena limpia y dejan todos los puntos seguros en level.ts.
import Phaser from "phaser";
import { FIRST_JOURNEY_SECTION } from "../data/level";

type PlayerBodyObject = Phaser.GameObjects.Rectangle;

// Sin flotador, tocar el agua real devuelve a Pablito al borde seguro.
export function respawnIfPlayerEnteredPool(
  player: PlayerBodyObject,
  playerBody: Phaser.Physics.Arcade.Body,
  floatCollected: boolean,
) {
  if (floatCollected) {
    return;
  }

  const { startX, endX, waterY, safeRespawn } = FIRST_JOURNEY_SECTION.pool;
  const isOverPool = player.x > startX && player.x < endX;
  const hasReachedWater = player.y > waterY - 46;

  if (isOverPool && hasReachedWater) {
    playerBody.reset(safeRespawn.x, safeRespawn.y);
  }
}

// Si Pablito cae fuera del mundo, vuelve al ultimo punto seguro alcanzado.
export function respawnIfPlayerFell(
  player: PlayerBodyObject,
  playerBody: Phaser.Physics.Arcade.Body,
) {
  const hasFallen =
    player.y > FIRST_JOURNEY_SECTION.worldHeight + 100 || player.x < -40;

  if (!hasFallen) {
    return;
  }

  const hasReachedDevZone = player.x >= 4200;
  const hasReachedWorkStudy = player.x >= 3250;
  const respawn = hasReachedDevZone
    ? FIRST_JOURNEY_SECTION.dev.safeRespawn
    : hasReachedWorkStudy
      ? FIRST_JOURNEY_SECTION.workStudy.safeRespawn
      : FIRST_JOURNEY_SECTION.safeRespawn;

  playerBody.reset(respawn.x, respawn.y);
}
