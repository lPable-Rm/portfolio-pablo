// Pantalla inicial del juego: portada "Press Start" y menu principal.
import Phaser from "phaser";
import { CV_FILE, GAME_SIZE, START_SCREEN_BACKGROUND } from "../config";

type StartScreenState = "cover" | "menu" | "instructions";
type MenuOption = "start" | "instructions" | "cv";

export class StartScene extends Phaser.Scene {
  // Evita que un click usado para volver desde la pantalla final avance dos pantallas.
  private canInteract = false;
  private screenState: StartScreenState = "cover";
  private selectedOption: MenuOption = "start";
  private uiObjects: Phaser.GameObjects.GameObject[] = [];
  private menuTexts: Record<MenuOption, Phaser.GameObjects.Text> | null = null;

  constructor() {
    super("StartScene");
  }

  // Cargamos el boceto/fondo de la pantalla de inicio.
  preload() {
    if (!this.textures.exists(START_SCREEN_BACKGROUND.key)) {
      this.load.image(START_SCREEN_BACKGROUND.key, START_SCREEN_BACKGROUND.url);
    }
  }

  create() {
    this.canInteract = false;
    this.screenState = "cover";
    this.selectedOption = "start";
    this.menuTexts = null;

    this.createBackground();
    this.createTitle();
    this.createCoverScreen();
    this.createControls();

    this.time.delayedCall(250, () => {
      this.canInteract = true;
    });
  }

  // La imagen se escala para cubrir todo el canvas sin deformarse.
  private createBackground() {
    const background = this.add.image(
      GAME_SIZE.width / 2,
      GAME_SIZE.height / 2,
      START_SCREEN_BACKGROUND.key,
    );
    const coverScale = Math.max(
      GAME_SIZE.width / background.width,
      GAME_SIZE.height / background.height,
    );

    background.setScale(coverScale);
    this.add
      .rectangle(0, 0, GAME_SIZE.width, GAME_SIZE.height, 0x020617, 0.28)
      .setOrigin(0);
  }

  private createTitle() {
    this.add
      .text(GAME_SIZE.width / 2, 96, "MI VIAJE", {
        align: "center",
        color: "#f6f7ff",
        fontFamily: "monospace",
        fontSize: "70px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(5, 5, "#ff4fd8", 0, true, true);

    this.add
      .text(GAME_SIZE.width / 2, 157, "LVL 01 · TODO EMPEZÓ CON CURIOSIDAD", {
        align: "center",
        color: "#42f8ff",
        fontFamily: "monospace",
        fontSize: "18px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#42f8ff", 8, true, true);

    this.add.rectangle(GAME_SIZE.width / 2 - 238, 158, 70, 2, 0xff4fd8, 0.85);
    this.add.rectangle(GAME_SIZE.width / 2 + 238, 158, 70, 2, 0x42f8ff, 0.85);
  }

  // Primera pantalla: solo pide empezar, como una recreativa clasica.
  private createCoverScreen() {
    this.clearUiObjects();

    const pressStart = this.add
      .text(GAME_SIZE.width / 2, GAME_SIZE.height / 2 + 52, "PRESS START", {
        color: "#ffe66d",
        fontFamily: "monospace",
        fontSize: "48px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ffe66d", 12, true, true);

    const hint = this.add
      .text(GAME_SIZE.width / 2, GAME_SIZE.height / 2 + 110, "ENTER / CLICK", {
        color: "#42f8ff",
        fontFamily: "monospace",
        fontSize: "15px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: pressStart,
      alpha: 0.24,
      duration: 650,
      yoyo: true,
      repeat: -1,
    });

    this.uiObjects.push(pressStart, hint);
  }

  // Segunda pantalla: menu real con Start, instrucciones y descarga de CV.
  private createMenuScreen() {
    this.clearUiObjects();

    const startText = this.createMenuOptionText("start", "START", 286);
    const instructionsText = this.createMenuOptionText(
      "instructions",
      "INSTRUCCIONES",
      350,
    );
    const cvText = this.createMenuOptionText("cv", "DESCARGAR CV", 414);

    const hint = this.add
      .text(
        GAME_SIZE.width / 2,
        GAME_SIZE.height - 32,
        "↑ ↓ PARA ELEGIR · ENTER / CLICK PARA CONFIRMAR",
        {
          color: "#b8c7ff",
          fontFamily: "monospace",
          fontSize: "13px",
        },
      )
      .setOrigin(0.5);

    this.menuTexts = {
      start: startText,
      instructions: instructionsText,
      cv: cvText,
    };

    this.uiObjects.push(startText, instructionsText, cvText, hint);
    this.renderMenuSelection();
  }

  // Pantalla sencilla con controles y objetivo del juego.
  private createInstructionsScreen() {
    this.clearUiObjects();
    this.menuTexts = null;

    const panel = this.add.rectangle(
      GAME_SIZE.width / 2,
      GAME_SIZE.height / 2 + 104,
      650,
      250,
      0x060a1f,
      0.72,
    );
    panel.setStrokeStyle(2, 0x42f8ff, 0.78);

    const title = this.add
      .text(GAME_SIZE.width / 2, GAME_SIZE.height / 2 + 8, "INSTRUCCIONES", {
        color: "#ffe66d",
        fontFamily: "monospace",
        fontSize: "26px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ffe66d", 10, true, true);

    const content = this.add
      .text(
        GAME_SIZE.width / 2,
        GAME_SIZE.height / 2 + 88,
        "← →   MOVERSE\nESPACIO   SALTAR\nRECOGE OBJETOS PARA DESBLOQUEAR ETAPAS\nEMPUJA BLOQUES PARA ABRIR CAMINO\nLLEGA AL PORTAL FINAL",
        {
          align: "center",
          color: "#f6f7ff",
          fontFamily: "monospace",
          fontSize: "18px",
          lineSpacing: 8,
        },
      )
      .setOrigin(0.5);

    const hint = this.add
      .text(GAME_SIZE.width / 2, GAME_SIZE.height - 32, "ENTER / CLICK PARA VOLVER", {
        color: "#42f8ff",
        fontFamily: "monospace",
        fontSize: "13px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.uiObjects.push(panel, title, content, hint);
  }

  private createMenuOptionText(
    option: MenuOption,
    label: string,
    y: number,
  ): Phaser.GameObjects.Text {
    const hitArea = this.add
      .rectangle(GAME_SIZE.width / 2, y, 420, 54, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    hitArea.on(
      "pointerdown",
      (
        _pointer: Phaser.Input.Pointer,
        _x: number,
        _y: number,
        event: Phaser.Types.Input.EventData,
      ) => {
        event.stopPropagation();

        if (!this.canInteract) {
          return;
        }

        this.selectedOption = option;
        this.activateSelectedOption();
      },
    );

    const text = this.add
      .text(GAME_SIZE.width / 2, y, label, {
        color: "#ffe66d",
        fontFamily: "monospace",
        fontSize: "30px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ffe66d", 9, true, true);

    this.uiObjects.push(hitArea);
    return text;
  }

  private createControls() {
    this.input.keyboard?.addCapture([
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    ]);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.confirmCurrentScreen();
    });

    this.input.keyboard?.on("keydown-UP", () => {
      this.moveMenuSelection(-1);
    });

    this.input.keyboard?.on("keydown-DOWN", () => {
      this.moveMenuSelection(1);
    });

    this.input.on("pointerdown", () => {
      if (this.screenState === "cover" || this.screenState === "instructions") {
        this.confirmCurrentScreen();
      }
    });
  }

  private confirmCurrentScreen() {
    if (!this.canInteract) {
      return;
    }

    if (this.screenState === "cover") {
      this.screenState = "menu";
      this.createMenuScreen();
      return;
    }

    if (this.screenState === "instructions") {
      this.screenState = "menu";
      this.createMenuScreen();
      return;
    }

    this.activateSelectedOption();
  }

  private moveMenuSelection(direction: -1 | 1) {
    if (this.screenState !== "menu") {
      return;
    }

    const options: MenuOption[] = ["start", "instructions", "cv"];
    const currentIndex = options.indexOf(this.selectedOption);
    const nextIndex =
      (currentIndex + direction + options.length) % options.length;

    this.selectedOption = options[nextIndex];

    this.renderMenuSelection();
  }

  private renderMenuSelection() {
    if (!this.menuTexts) {
      return;
    }

    this.menuTexts.start.setText(
      `${this.selectedOption === "start" ? "▶ " : "  "}START${
        this.selectedOption === "start" ? " ◀" : "  "
      }`,
    );
    this.menuTexts.instructions.setText(
      `${this.selectedOption === "instructions" ? "▶ " : "  "}INSTRUCCIONES${
        this.selectedOption === "instructions" ? " ◀" : "  "
      }`,
    );
    this.menuTexts.cv.setText(
      `${this.selectedOption === "cv" ? "▶ " : "  "}DESCARGAR CV${
        this.selectedOption === "cv" ? " ◀" : "  "
      }`,
    );
  }

  private activateSelectedOption() {
    if (this.selectedOption === "start") {
      this.scene.start("JourneyScene");
      return;
    }

    if (this.selectedOption === "instructions") {
      this.screenState = "instructions";
      this.createInstructionsScreen();
      return;
    }

    this.downloadCv();
  }

  private downloadCv() {
    const link = document.createElement("a");
    link.href = CV_FILE.url;
    link.download = CV_FILE.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private clearUiObjects() {
    this.uiObjects.forEach((object) => object.destroy());
    this.uiObjects = [];
  }
}
