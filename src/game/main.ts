// Importa Phaser para poder crear la instancia del juego.
import Phaser from "phaser";

// Configuracion comun del juego.
import { GAME_SIZE } from "./config";

// Importa las escenas del mini juego.
import { EndScene } from "./scenes/EndScene";
import { JourneyScene } from "./scenes/JourneyScene";
import { StartScene } from "./scenes/StartScene";

// Recibe el div creado por GameWrapper y crea Phaser dentro de él.
export function createGame(parent: HTMLElement): Phaser.Game {
  // Devuelve una nueva instancia de Phaser.Game.
  return new Phaser.Game({
    // Phaser intentará usar WebGL y recurrirá a Canvas si fuera necesario.
    type: Phaser.AUTO,

    // Indica el elemento HTML que contendrá el canvas del juego.
    parent,

    // Resolución base sobre la que se diseña el juego.
    width: GAME_SIZE.width,
    height: GAME_SIZE.height,

    // Evita el suavizado de píxeles al escalar gráficos pixelados.
    pixelArt: true,

    // Configuración de físicas.
    physics: {
      // Usaremos las físicas sencillas incluidas en Phaser.
      default: "arcade",

      arcade: {
        // Gravedad global que afectará al jugador y otros objetos dinámicos.
        gravity: { y: 1000 },

        // Muestra límites y cuerpos físicos solo si vale true.
        debug: false,
      },
    },

    // Hace que el canvas se adapte al ancho disponible sin deformarse.
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_SIZE.width,
      height: GAME_SIZE.height,
    },

    // Lista de escenas que puede ejecutar el juego.
    // Phaser arranca por la primera: StartScene.
    scene: [StartScene, JourneyScene, EndScene],
  });
}
