// Caja de dialogo fija sobre la pantalla del juego.
import Phaser from "phaser";

const MIN_READING_TIME = 3000;
const MAX_READING_TIME = 6200;
const READING_TIME_PER_CHARACTER = 42;
const DIALOGUE_FONT = '"Pixelify Sans", monospace';

export class DialogueBox {
  private readonly box: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private queue: string[] = [];
  private currentMessage = "";
  private currentMessageStartedAt = 0;
  private currentMessageReadingTime = 0;
  private switchEvent?: Phaser.Time.TimerEvent;

  constructor(private readonly scene: Phaser.Scene) {
    this.box = scene.add
      .rectangle(24, 24, 460, 140, 0x0d1230, 0.96)
      .setOrigin(0)
      .setStrokeStyle(2, 0xff4fd8);
    this.box.setScrollFactor(0);

    this.text = scene.add.text(44, 52, "", {
      color: "#f6f7ff",
      fontFamily: DIALOGUE_FONT,
      fontSize: "18px",
      lineSpacing: 2,
      wordWrap: { width: 410 },
    });
    this.text.setPadding(0, 4, 0, 0);
    this.text.setScrollFactor(0);
    this.setVisible(false);
  }

  show(message: string) {
    if (!this.currentMessage) {
      this.displayNow(message);
      return;
    }

    if (this.currentMessage === message || this.queue.includes(message)) {
      return;
    }

    const elapsed = this.scene.time.now - this.currentMessageStartedAt;
    if (elapsed >= this.currentMessageReadingTime && this.queue.length === 0) {
      this.displayNow(message);
      return;
    }

    this.queue.push(message);
    this.scheduleNextMessage();
  }

  clear() {
    this.queue = [];
    this.currentMessage = "";
    this.switchEvent?.remove(false);
    this.switchEvent = undefined;
    this.text.setText("");
    this.setVisible(false);
  }

  private displayNow(message: string) {
    this.currentMessage = message;
    this.currentMessageStartedAt = this.scene.time.now;
    this.currentMessageReadingTime = this.getReadingTime(message);
    this.setVisible(true);
    this.text.setText(message);
    this.scheduleNextMessage();
  }

  private scheduleNextMessage() {
    if (this.queue.length === 0 || this.switchEvent) {
      return;
    }

    const elapsed = this.scene.time.now - this.currentMessageStartedAt;
    const delay = Math.max(0, this.currentMessageReadingTime - elapsed);

    this.switchEvent = this.scene.time.delayedCall(delay, () => {
      this.switchEvent = undefined;
      const nextMessage = this.queue.shift();

      if (nextMessage) {
        this.displayNow(nextMessage);
      }
    });
  }

  private getReadingTime(message: string): number {
    return Phaser.Math.Clamp(
      message.length * READING_TIME_PER_CHARACTER,
      MIN_READING_TIME,
      MAX_READING_TIME,
    );
  }

  private setVisible(isVisible: boolean) {
    this.box.setVisible(isVisible);
    this.text.setVisible(isVisible);
  }
}
