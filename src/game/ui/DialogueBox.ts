// Caja de dialogo fija sobre la pantalla del juego.
import Phaser from "phaser";

export class DialogueBox {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const box = scene.add
      .rectangle(24, 24, 460, 140, 0x0d1230, 0.96)
      .setOrigin(0)
      .setStrokeStyle(2, 0xff4fd8);
    box.setScrollFactor(0);

    this.text = scene.add.text(44, 52, "", {
      color: "#f6f7ff",
      fontFamily: "monospace",
      fontSize: "18px",
      lineSpacing: 5,
      wordWrap: { width: 410 },
    });
    this.text.setPadding(0, 4, 0, 0);
    this.text.setScrollFactor(0);
  }

  show(message: string) {
    this.text.setText(message);
  }
}
