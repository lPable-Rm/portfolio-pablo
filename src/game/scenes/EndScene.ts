// Pantalla final del juego con cierre narrativo y rutas utiles del portfolio.
import Phaser from "phaser";
import { stopGameMusic } from "../audio/gameMusic";
import { GAME_SIZE, START_SCREEN_BACKGROUND } from "../config";
import { MuteButton } from "../ui/MuteButton";

type EndMenuOption = "projects" | "contact" | "menu";
const END_SCREEN_FONT = '"Pixelify Sans", monospace';
const END_MENU_FONT = "monospace";
const FINAL_MESSAGE =
  "Gracias  por  llegar  hasta  el  final.\n\nMe  gusta  construir,  aprender\ny  convertir  ideas  en  proyectos  reales.\n\nEste  juego  resume  el  camino.\nMis  proyectos  muestran  hacia  dónde  voy.";
const TYPEWRITER_DELAY = 18;

export class EndScene extends Phaser.Scene {
  // Pequeño bloqueo para evitar dobles entradas al aparecer la pantalla.
  private canInteract = false;
  private selectedOption: EndMenuOption = "projects";
  private menuTexts: Record<EndMenuOption, Phaser.GameObjects.Text> | null =
    null;
  private finalMessageText!: Phaser.GameObjects.Text;
  private muteButton?: MuteButton;

  constructor() {
    super("EndScene");
  }

  // Usamos el mismo fondo limpio de la pantalla inicial para cerrar el ciclo.
  preload() {
    if (!this.textures.exists(START_SCREEN_BACKGROUND.key)) {
      this.load.image(START_SCREEN_BACKGROUND.key, START_SCREEN_BACKGROUND.url);
    }
  }

  create() {
    this.canInteract = false;
    this.selectedOption = "projects";

    this.createBackground();
    this.createShootingStars();
    this.createTitle();
    this.createMessagePanel();
    this.createControls();
    this.muteButton = new MuteButton(this);
    this.startTypewriterEffect();
  }

  update() {
    this.muteButton?.update();
  }

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
      .rectangle(0, 0, GAME_SIZE.width, GAME_SIZE.height, 0x020617, 0.3)
      .setOrigin(0);
  }

  private createTitle() {
    this.add
      .text(GAME_SIZE.width / 2, 56, "CONGRATULATIONS!", {
        color: "#42f8ff",
        fontFamily: END_SCREEN_FONT,
        fontSize: "32px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#42f8ff", 12, true, true);

    this.add
      .text(GAME_SIZE.width / 2, 116, "PABLO DEV DESBLOQUEADO", {
        color: "#ff4fd8",
        fontFamily: END_SCREEN_FONT,
        fontSize: "42px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(4, 4, "#16225f", 0, true, true);
  }

  private createMessagePanel() {
    const panelX = GAME_SIZE.width / 2;
    const panelY = GAME_SIZE.height / 2 + 20;
    const separatorWidth = 220;
    const topLineY = panelY - 116;
    const bottomLineY = panelY + 116;

    this.createHeartSeparator(panelX, topLineY, separatorWidth);
    this.createHeartSeparator(panelX, bottomLineY, separatorWidth);

    this.finalMessageText = this.add
      .text(
        panelX,
        panelY - 78,
        "",
        {
          align: "center",
          color: "#42f8ff",
          fontFamily: END_SCREEN_FONT,
          fontSize: "21px",
          lineSpacing: 1,
          wordWrap: { width: 620 },
        },
      )
      .setOrigin(0.5, 0)
      .setShadow(0, 0, "#42f8ff", 4, true, true);
  }

  private createHeartSeparator(x: number, y: number, width: number) {
    this.add.rectangle(x - width / 2 - 24, y, width, 2, 0xff4fd8, 0.72);
    this.add.rectangle(x + width / 2 + 24, y, width, 2, 0x42f8ff, 0.72);

    this.add
      .text(x, y, "♥", {
        color: "#ff4fd8",
        fontFamily: END_SCREEN_FONT,
        fontSize: "20px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ff4fd8", 9, true, true);
  }

  private startTypewriterEffect() {
    let currentIndex = 0;

    this.time.addEvent({
      delay: TYPEWRITER_DELAY,
      repeat: FINAL_MESSAGE.length - 1,
      callback: () => {
        currentIndex += 1;
        this.finalMessageText.setText(FINAL_MESSAGE.slice(0, currentIndex));

        if (currentIndex === FINAL_MESSAGE.length) {
          this.createMenu();
          this.canInteract = true;
        }
      },
    });
  }

  private createMenu() {
    const projectsText = this.createMenuOptionText(
      "projects",
      "VER PROYECTOS",
      452,
    );
    const contactText = this.createMenuOptionText("contact", "CONTACTO", 488);
    const menuText = this.createMenuOptionText("menu", "VOLVER AL MENÚ", 524);

    this.menuTexts = {
      projects: projectsText,
      contact: contactText,
      menu: menuText,
    };

    this.renderMenuSelection();
  }

  private createMenuOptionText(
    option: EndMenuOption,
    label: string,
    y: number,
  ): Phaser.GameObjects.Text {
    const hitArea = this.add
      .rectangle(GAME_SIZE.width / 2, y, 430, 38, 0xffffff, 0)
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

    return this.add
      .text(GAME_SIZE.width / 2, y, label, {
        color: "#ffe66d",
        fontFamily: END_MENU_FONT,
        fontSize: "22px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ffe66d", 9, true, true);
  }

  private createControls() {
    this.input.keyboard?.addCapture([
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    ]);

    this.input.keyboard?.on("keydown-ENTER", () => {
      this.confirmSelection();
    });

    this.input.keyboard?.on("keydown-UP", () => {
      this.moveMenuSelection(-1);
    });

    this.input.keyboard?.on("keydown-DOWN", () => {
      this.moveMenuSelection(1);
    });
  }

  private moveMenuSelection(direction: -1 | 1) {
    const options: EndMenuOption[] = ["projects", "contact", "menu"];
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

    this.menuTexts.projects.setText(
      `${this.selectedOption === "projects" ? "▶ " : "  "}VER PROYECTOS${
        this.selectedOption === "projects" ? " ◀" : "  "
      }`,
    );
    this.menuTexts.contact.setText(
      `${this.selectedOption === "contact" ? "▶ " : "  "}CONTACTO${
        this.selectedOption === "contact" ? " ◀" : "  "
      }`,
    );
    this.menuTexts.menu.setText(
      `${this.selectedOption === "menu" ? "▶ " : "  "}VOLVER AL MENÚ${
        this.selectedOption === "menu" ? " ◀" : "  "
      }`,
    );
  }

  private confirmSelection() {
    if (!this.canInteract) {
      return;
    }

    this.activateSelectedOption();
  }

  private activateSelectedOption() {
    if (this.selectedOption === "projects") {
      this.goToPageSection("proyectos");
      return;
    }

    if (this.selectedOption === "contact") {
      this.goToPageSection("contacto");
      return;
    }

    stopGameMusic(this);
    this.scene.start("StartScene");
  }

  private goToPageSection(sectionId: string) {
    const targetSection = document.getElementById(sectionId);

    stopGameMusic(this);
    window.location.hash = sectionId;
    targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Estrellas fugaces sencillas generadas con formas Phaser.
  private createShootingStars() {
    this.time.addEvent({
      delay: 1400,
      loop: true,
      callback: () => {
        const startX = Phaser.Math.Between(90, GAME_SIZE.width - 180);
        const startY = Phaser.Math.Between(40, 190);
        const length = Phaser.Math.Between(70, 130);
        const color = Phaser.Math.RND.pick([0x42f8ff, 0xff4fd8]);
        const star = this.add.line(
          0,
          0,
          startX,
          startY,
          startX + length,
          startY - 34,
          color,
          1,
        );

        star.setLineWidth(3, 1);
        star.setAlpha(0);

        this.tweens.add({
          targets: star,
          x: 90,
          y: -42,
          alpha: { from: 0.9, to: 0 },
          duration: 900,
          ease: "Sine.easeOut",
          onComplete: () => {
            star.destroy();
          },
        });
      },
    });
  }
}
