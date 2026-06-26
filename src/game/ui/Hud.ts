// HUD compacta con stats narrativas del viaje.
import Phaser from "phaser";
import { GAME_SIZE } from "../config";

type StatKey = "curiosity" | "discipline" | "calm" | "organization" | "dev";

const STAT_LABELS: Record<StatKey, string> = {
  curiosity: "CUR",
  discipline: "CON",
  calm: "CAL",
  organization: "ORG",
  dev: "DEV",
};

export class Hud {
  private stats: Record<StatKey, number> = {
    curiosity: 0,
    discipline: 0,
    calm: 0,
    organization: 0,
    dev: 0,
  };

  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(GAME_SIZE.width - 24, 28, "", {
      align: "right",
      color: "#42f8ff",
      fontFamily: "monospace",
      fontSize: "14px",
      fontStyle: "bold",
    });

    this.text.setOrigin(1, 0);
    this.text.setScrollFactor(0);
    this.text.setShadow(0, 0, "#42f8ff", 8, true, true);
    this.render();
  }

  setStat(stat: StatKey, value: number) {
    this.stats[stat] = value;
    this.render();
  }

  private render() {
    const content = Object.entries(STAT_LABELS)
      .map(([key, label]) => `${label} ${this.stats[key as StatKey]}`)
      .join(" | ");

    this.text.setText(content);
  }
}
