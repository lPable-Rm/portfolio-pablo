// Pantalla final del juego. De momento es un cierre placeholder sin assets finales.
import Phaser from "phaser";
import { GAME_SIZE, JOURNEY_BACKGROUND } from "../config";

export class EndScene extends Phaser.Scene {
  // Pequeño bloqueo para evitar dobles entradas al aparecer la pantalla.
  private canRestart = false;

  constructor() {
    super("EndScene");
  }

  // Si el jugador llega aqui desde otra ruta, la escena puede cargar el fondo igualmente.
  preload() {
    if (!this.textures.exists(JOURNEY_BACKGROUND.key)) {
      this.load.image(JOURNEY_BACKGROUND.key, JOURNEY_BACKGROUND.url);
    }
  }

  create() {
    this.canRestart = false;
    this.createBackground();
    this.createEndPanel();
    this.createRestartControls();

    this.time.delayedCall(250, () => {
      this.canRestart = true;
    });
  }

  private createBackground() {
    const background = this.add.image(
      GAME_SIZE.width / 2,
      GAME_SIZE.height / 2,
      JOURNEY_BACKGROUND.key,
    );
    const coverScale = Math.max(
      GAME_SIZE.width / background.width,
      GAME_SIZE.height / background.height,
    );

    background.setScale(coverScale);
    this.add
      .rectangle(0, 0, GAME_SIZE.width, GAME_SIZE.height, 0x020617, 0.7)
      .setOrigin(0);
  }

  private createEndPanel() {
    this.add
      .text(GAME_SIZE.width / 2, 92, "QUEST COMPLETE", {
        color: "#ffe66d",
        fontFamily: "monospace",
        fontSize: "46px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(4, 4, "#ff4fd8", 0, true, true);

    this.add
      .text(GAME_SIZE.width / 2, 142, "PABLO DEV DESBLOQUEADO", {
        color: "#42f8ff",
        fontFamily: "monospace",
        fontSize: "20px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#42f8ff", 10, true, true);

    const panel = this.add.rectangle(
      GAME_SIZE.width / 2,
      GAME_SIZE.height / 2 + 28,
      620,
      220,
      0x0d1230,
      0.9,
    );
    panel.setStrokeStyle(3, 0x42f8ff, 0.9);

    this.add
      .text(
        GAME_SIZE.width / 2,
        GAME_SIZE.height / 2 + 2,
        "CONGRATULATIONS!\n\nHas desbloqueado a PABLO DEV.\n\nListo para unirse a tu equipo,\nresolver bugs y construir cosas útiles.",
        {
          align: "center",
          color: "#f6f7ff",
          fontFamily: "monospace",
          fontSize: "18px",
          lineSpacing: 7,
        },
      )
      .setOrigin(0.5);

    const restart = this.add
      .text(
        GAME_SIZE.width / 2,
        GAME_SIZE.height - 58,
        "PRESS START PARA REINICIAR",
        {
          color: "#ff4fd8",
          fontFamily: "monospace",
          fontSize: "22px",
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5)
      .setShadow(0, 0, "#ff4fd8", 12, true, true);

    this.tweens.add({
      targets: restart,
      alpha: 0.24,
      duration: 650,
      yoyo: true,
      repeat: -1,
    });
  }

  private createRestartControls() {
    this.input.keyboard?.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard?.once("keydown-ENTER", this.restartGame, this);
    this.input.once("pointerdown", this.restartGame, this);
  }

  private restartGame() {
    if (!this.canRestart) {
      return;
    }

    this.scene.start("StartScene");
  }
}
