// Fondos panoramicos de la escena Mi viaje.
// Se cargan desde public/assets para que Phaser pueda pedirlos por URL directa.
import Phaser from "phaser";

export const JOURNEY_BACKGROUNDS = [
  {
    key: "journey-background-1",
    url: "/assets/game/backgrounds/fondo1.png",
  },
  {
    key: "journey-background-3",
    url: "/assets/game/backgrounds/fondo3.png",
  },
  {
    key: "journey-background-4",
    url: "/assets/game/backgrounds/fondo4.png",
  },
] as const;

export function preloadJourneyBackgrounds(scene: Phaser.Scene) {
  for (const background of JOURNEY_BACKGROUNDS) {
    if (!scene.textures.exists(background.key)) {
      scene.load.image(background.key, background.url);
    }
  }
}
