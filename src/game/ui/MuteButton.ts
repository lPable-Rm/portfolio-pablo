// Boton pequeno para mutear o reactivar la musica sin ocupar el HUD principal.
import Phaser from "phaser";
import { GAME_SIZE } from "../config";
import { isGameMusicMuted, toggleGameMusicMuted } from "../audio/gameMusic";

export class MuteButton {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private readonly muteKey?: Phaser.Input.Keyboard.Key;

  constructor(private readonly scene: Phaser.Scene) {
    const x = GAME_SIZE.width - 42;
    const y = GAME_SIZE.height - 28;

    this.background = scene.add
      .rectangle(x, y, 58, 24, 0x060a1f, 0.78)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    this.label = scene.add
      .text(x, y, "", {
        align: "center",
        color: "#42f8ff",
        fontFamily: "monospace",
        fontSize: "12px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    this.background.on(
      "pointerdown",
      (
        _pointer: Phaser.Input.Pointer,
        _x: number,
        _y: number,
        event: Phaser.Types.Input.EventData,
      ) => {
        event.stopPropagation();
        this.toggle();
      },
    );

    this.background.on("pointerover", () => {
      this.background.setAlpha(1);
    });

    this.background.on("pointerout", () => {
      this.background.setAlpha(0.78);
    });

    const keyboard = scene.input.keyboard;

    if (keyboard) {
      keyboard.addCapture([Phaser.Input.Keyboard.KeyCodes.M]);
      this.muteKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    this.render();
  }

  update() {
    if (!this.muteKey || !Phaser.Input.Keyboard.JustDown(this.muteKey)) {
      return;
    }

    this.toggle();
  }

  private toggle() {
    toggleGameMusicMuted(this.scene);
    this.render();
  }

  private render() {
    const isMuted = isGameMusicMuted(this.scene);
    const color = isMuted ? 0xff4fd8 : 0x42f8ff;
    const textColor = isMuted ? "#ff4fd8" : "#42f8ff";

    this.background.setStrokeStyle(1, color, 0.9);
    this.label.setColor(textColor);
    this.label.setText(isMuted ? "MUT" : "SND");
  }
}
