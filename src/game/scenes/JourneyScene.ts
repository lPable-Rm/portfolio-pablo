// Primer tramo jugable de Mi viaje. Todo usa formas placeholder de Phaser.
import Phaser from "phaser";
import {
  createDevPlatforms,
  createGround,
  createPool,
  createStars,
  createWorkStudyPlatforms,
} from "../builders/levelBuilders";
import { JOURNEY_DIALOGUE } from "../data/dialogue";
import { FIRST_JOURNEY_SECTION } from "../data/level";
import { DialogueBox } from "../ui/DialogueBox";
import { Hud } from "../ui/Hud";

const PLAYER_SPEED = 240;
const JUMP_VELOCITY = -460;

// Escala visual temporal del sprite.
// El cuerpo fisico sigue siendo el rectangulo invisible; esto solo agranda el dibujo.
const PLAYER_SPRITE_SCALE = 1.6;

const PABLITO_SMALL_IDLE_ANIMATION = "pablito-small-idle";
const PABLITO_SMALL_WALK_ANIMATION = "pablito-small-walk";
const PABLITO_SMALL_JUMP_FRAME = {
  key: "pablito-small-jump",
  url: "/assets/game/player/pablito-small/jump-test-32.png",
};
const PABLITO_SMALL_FALL_FRAME = {
  key: "pablito-small-fall",
  url: "/assets/game/player/pablito-small/fall-test-32.png",
};
const PABLITO_SMALL_IDLE_FRAMES = [
  {
    key: "pablito-small-idle-1",
    url: "/assets/game/player/pablito-small/idle-1-test-32.png",
  },
  {
    key: "pablito-small-idle-2",
    url: "/assets/game/player/pablito-small/idle-2-test-32.png",
  },
];
const PABLITO_SMALL_WALK_FRAMES = [
  {
    key: "pablito-small-walk-1",
    url: "/assets/game/player/pablito-small/walk-1-test-32.png",
  },
  {
    key: "pablito-small-walk-2",
    url: "/assets/game/player/pablito-small/walk-2-test-32.png",
  },
  {
    key: "pablito-small-walk-3",
    url: "/assets/game/player/pablito-small/walk-3-test-32.png",
  },
  {
    key: "pablito-small-walk-4",
    url: "/assets/game/player/pablito-small/walk-4-test-32.png",
  },
];

// Pequenas ayudas de control para que el salto se sienta justo:
// - coyote time: deja saltar un instante despues de perder el suelo.
// - jump buffer: recuerda el salto si se pulsa justo antes de tocar suelo.
const COYOTE_TIME_MS = 140;
const JUMP_BUFFER_MS = 140;

export class JourneyScene extends Phaser.Scene {
  // Jugador placeholder y su cuerpo fisico Arcade.
  private player!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private playerSprite!: Phaser.GameObjects.Sprite;

  // Suelo segmentado: deja un hueco entre las dos zonas de plataforma.
  private platforms: Phaser.GameObjects.Rectangle[] = [];

  // Bloque dinamico que se vuelve empujable al recoger la pesa.
  private block!: Phaser.GameObjects.Rectangle;
  private blockBody!: Phaser.Physics.Arcade.Body;
  private blockLabel!: Phaser.GameObjects.Text;

  // Pesa: una zona fisica invisible y sus piezas visuales placeholder.
  private weightPickup!: Phaser.GameObjects.Rectangle;
  private weightVisuals: Phaser.GameObjects.GameObject[] = [];

  // Flotador, plataforma invisible de agua y aro visual tras recogerlo.
  private floatPickup!: Phaser.GameObjects.Rectangle;
  private floatVisuals: Phaser.GameObjects.GameObject[] = [];
  private floatAura?: Phaser.GameObjects.Graphics;

  // Items de la zona de trabajo + estudio.
  private boxPickup!: Phaser.GameObjects.Rectangle;
  private boxLabel!: Phaser.GameObjects.Text;
  private notebookPickup!: Phaser.GameObjects.Rectangle;
  private notebookLabel!: Phaser.GameObjects.Text;

  // Portatil y meta temporal de la ultima zona.
  private laptopPickup!: Phaser.GameObjects.Rectangle;
  private laptopVisuals: Phaser.GameObjects.GameObject[] = [];
  private finishZone!: Phaser.GameObjects.Rectangle;

  // Elementos de interfaz y teclado.
  private dialogue!: DialogueBox;
  private hud!: Hud;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private menuKey!: Phaser.Input.Keyboard.Key;

  // Guardan los ultimos momentos relevantes para calcular el salto tolerante.
  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private lastJumpPressedAt = Number.NEGATIVE_INFINITY;

  // Estados narrativos pedidos para las dos primeras zonas.
  private introDialogueShown = false;
  private hasWeightPower = false;
  private weightCollected = false;
  private powerUpDialogueShown = false;
  private sportDialogueShown = false;
  private hasFloatPower = false;
  private floatCollected = false;
  private floatDialogueShown = false;
  private lifeguardDialogueShown = false;
  private hasBox = false;
  private hasNotebook = false;
  private hasWorkStudyPower = false;
  private boxCollected = false;
  private notebookCollected = false;
  private workStudyPowerShown = false;
  private workStudyDialogueShown = false;
  private hasLaptop = false;
  private laptopCollected = false;
  private isPabloDev = false;
  private pabloDevPowerShown = false;
  private finalDialogueShown = false;

  // Estado interno para fijar el bloque cuando ya ocupa el hueco.
  private blockIsBridge = false;

  constructor() {
    super("JourneyScene");
  }

  // Cargamos los sprites temporales del jugador desde public/assets.
  preload() {
    const playerFrames = [
      ...PABLITO_SMALL_IDLE_FRAMES,
      ...PABLITO_SMALL_WALK_FRAMES,
      PABLITO_SMALL_JUMP_FRAME,
      PABLITO_SMALL_FALL_FRAME,
    ];

    for (const frame of playerFrames) {
      if (!this.textures.exists(frame.key)) {
        this.load.image(frame.key, frame.url);
      }
    }
  }

  // Phaser llama a create una sola vez cuando arranca la escena.
  create() {
    this.resetState();
    this.cameras.main.setBackgroundColor("#070b1d");

    this.physics.world.setBounds(
      0,
      0,
      FIRST_JOURNEY_SECTION.worldWidth,
      FIRST_JOURNEY_SECTION.worldHeight,
    );
    this.cameras.main.setBounds(
      0,
      0,
      FIRST_JOURNEY_SECTION.worldWidth,
      FIRST_JOURNEY_SECTION.worldHeight,
    );

    createStars(this);
    createGround(this, this.platforms);
    createWorkStudyPlatforms(this, this.platforms);
    createDevPlatforms(this, this.platforms);
    this.createPlayer();
    this.createWeight();
    this.createFloat();
    createPool(this);
    this.createWorkStudyItems();
    this.createLaptop();
    this.createFinishPortal();
    this.createCollisions();
    this.createControls();
    this.dialogue = new DialogueBox(this);
    this.hud = new Hud(this);
    this.showIntroDialogue();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  // Phaser llama a update en cada fotograma.
  update() {
    this.updatePlayerMovement();
    this.updatePlayerSprite();
    this.updateFloatAura();
    this.checkBlockBridge();
    this.checkPoolRespawn();
    this.checkFallRespawn();
    this.checkSportDialogue();
    this.checkLifeguardDialogue();
    this.checkWorkStudyDialogue();
  }

  // Phaser reutiliza la misma instancia de Scene al reiniciar.
  // Por eso limpiamos estados y arrays antes de reconstruir el nivel.
  private resetState() {
    this.platforms = [];
    this.weightVisuals = [];
    this.floatVisuals = [];
    this.laptopVisuals = [];
    this.floatAura = undefined;

    this.introDialogueShown = false;
    this.hasWeightPower = false;
    this.weightCollected = false;
    this.powerUpDialogueShown = false;
    this.sportDialogueShown = false;
    this.hasFloatPower = false;
    this.floatCollected = false;
    this.floatDialogueShown = false;
    this.lifeguardDialogueShown = false;
    this.hasBox = false;
    this.hasNotebook = false;
    this.hasWorkStudyPower = false;
    this.boxCollected = false;
    this.notebookCollected = false;
    this.workStudyPowerShown = false;
    this.workStudyDialogueShown = false;
    this.hasLaptop = false;
    this.laptopCollected = false;
    this.isPabloDev = false;
    this.pabloDevPowerShown = false;
    this.finalDialogueShown = false;
    this.blockIsBridge = false;
    this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    this.lastJumpPressedAt = Number.NEGATIVE_INFINITY;
  }

  // Pablito pequeno: una forma temporal hasta disponer de su spritesheet.
  private createPlayer() {
    this.player = this.add.rectangle(
      FIRST_JOURNEY_SECTION.playerStart.x,
      FIRST_JOURNEY_SECTION.playerStart.y,
      28,
      44,
      0x42f8ff,
    );
    this.player.setStrokeStyle(2, 0xf6f7ff, 0.85);

    this.physics.add.existing(this.player);
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    // Permitimos caer para poder detectar el hueco y reaparecer de forma segura.
    this.playerBody.setCollideWorldBounds(false);

    // El rectangulo sigue siendo el cuerpo fisico, pero no lo dibujamos.
    // Encima colocamos el sprite temporal para probar el estilo visual.
    this.player.setVisible(false);
    this.createPlayerSprite();
  }

  // Crea las animaciones temporales de prueba usando frames sueltos.
  private createPlayerSprite() {
    this.createPlayerAnimation(
      PABLITO_SMALL_IDLE_ANIMATION,
      PABLITO_SMALL_IDLE_FRAMES,
      3,
    );
    this.createPlayerAnimation(
      PABLITO_SMALL_WALK_ANIMATION,
      PABLITO_SMALL_WALK_FRAMES,
      8,
    );

    this.playerSprite = this.add
      .sprite(this.player.x, this.getPlayerFeetY(), "pablito-small-idle-1")
      .setOrigin(0.5, 1)
      .setScale(PLAYER_SPRITE_SCALE)
      .setDepth(5);

    this.playerSprite.play(PABLITO_SMALL_IDLE_ANIMATION);
  }

  private createPlayerAnimation(
    key: string,
    frames: typeof PABLITO_SMALL_IDLE_FRAMES,
    frameRate: number,
  ) {
    if (this.anims.exists(key)) {
      return;
    }

    this.anims.create({
      key,
      frames: frames.map((frame) => ({ key: frame.key })),
      frameRate,
      repeat: -1,
    });
  }

  // Mantiene el sprite visual pegado al cuerpo fisico invisible y cambia animacion.
  private updatePlayerSprite() {
    if (!this.playerSprite) {
      return;
    }

    this.playerSprite.setPosition(this.player.x, this.getPlayerFeetY());
    this.updatePlayerSpriteAnimation();

    // El sprite original mira a la derecha; al movernos a la izquierda lo invertimos.
    if (this.playerBody.velocity.x !== 0) {
      this.playerSprite.setFlipX(this.playerBody.velocity.x < 0);
    }
  }

  // Cambia entre idle, caminar, salto y caida segun el estado fisico del jugador.
  private updatePlayerSpriteAnimation() {
    const isJumping = this.playerBody.velocity.y < -20;
    const isFalling =
      this.playerBody.velocity.y > 20 && !this.isPlayerTouchingGround();

    if (isJumping) {
      this.playerSprite.stop();
      this.playerSprite.setTexture(PABLITO_SMALL_JUMP_FRAME.key);
      return;
    }

    if (isFalling) {
      this.playerSprite.stop();
      this.playerSprite.setTexture(PABLITO_SMALL_FALL_FRAME.key);
      return;
    }

    const isWalking =
      Math.abs(this.playerBody.velocity.x) > 5 && this.isPlayerTouchingGround();
    const nextAnimation = isWalking
      ? PABLITO_SMALL_WALK_ANIMATION
      : PABLITO_SMALL_IDLE_ANIMATION;
    const currentAnimation = this.playerSprite.anims.currentAnim?.key;
    const animationIsStopped = !this.playerSprite.anims.isPlaying;

    // Si venimos de jump/fall, la animacion esta parada aunque currentAnim
    // pueda seguir apuntando a idle/walk. Por eso tambien comprobamos isPlaying.
    if (animationIsStopped || currentAnimation !== nextAnimation) {
      this.playerSprite.play(nextAnimation);
    }
  }

  private getPlayerFeetY(): number {
    return this.player.y + this.player.displayHeight / 2;
  }

  // La pesa se dibuja con formas; el rectangulo invisible detecta la recogida.
  private createWeight() {
    const { x, y } = FIRST_JOURNEY_SECTION.weight;
    const leftPlate = this.add.rectangle(x - 13, y, 10, 30, 0xffe66d);
    const handle = this.add.rectangle(x, y, 18, 8, 0x42f8ff);
    const rightPlate = this.add.rectangle(x + 13, y, 10, 30, 0xffe66d);
    const label = this.add.text(x, y - 32, "PESA", {
      color: "#ffe66d",
      fontFamily: "monospace",
      fontSize: "13px",
    });

    label.setOrigin(0.5);
    this.weightVisuals = [leftPlate, handle, rightPlate, label];

    this.weightPickup = this.add.rectangle(x, y, 42, 34, 0xffffff, 0);
    this.physics.add.existing(this.weightPickup, true);
    this.physics.add.overlap(this.player, this.weightPickup, () => {
      this.collectWeight();
    });
  }

  // Flotador placeholder: aro naranja/cyan y una zona de overlap transparente.
  private createFloat() {
    const { x, y } = FIRST_JOURNEY_SECTION.float;
    const ring = this.add.graphics();
    ring.lineStyle(6, 0xffa24a, 1);
    ring.strokeCircle(x, y, 18);
    ring.lineStyle(2, 0x42f8ff, 0.9);
    ring.strokeCircle(x, y, 11);

    const label = this.add.text(x, y - 34, "FLOTADOR", {
      color: "#ffb45b",
      fontFamily: "monospace",
      fontSize: "13px",
    });
    label.setOrigin(0.5);
    this.floatVisuals = [ring, label];

    this.floatPickup = this.add.rectangle(x, y, 44, 44, 0xffffff, 0);
    this.physics.add.existing(this.floatPickup, true);
    this.physics.add.overlap(this.player, this.floatPickup, () => {
      this.collectFloat();
    });
  }

  // La plataforma invisible permite cruzar el agua sin crear natacion todavia.
  private createPoolCrossingPlatform() {
    const { centerX, waterY, width } = FIRST_JOURNEY_SECTION.pool;
    const crossingPlatform = this.add.rectangle(
      centerX,
      waterY,
      width,
      FIRST_JOURNEY_SECTION.groundHeight,
      0xffffff,
      0,
    );

    this.physics.add.existing(crossingPlatform, true);
    this.physics.add.collider(this.player, crossingPlatform);
  }

  // Caja y libreta: dos objetos simples que activan la etapa de trabajo + estudio.
  private createWorkStudyItems() {
    const { box, notebook } = FIRST_JOURNEY_SECTION.workStudy;

    this.boxPickup = this.add.rectangle(box.x, box.y, 42, 34, 0xb66a3c);
    this.boxPickup.setStrokeStyle(2, 0xffb45b, 0.9);
    this.boxLabel = this.add.text(box.x, box.y - 30, "CAJA", {
      color: "#ffb45b",
      fontFamily: "monospace",
      fontSize: "13px",
    });
    this.boxLabel.setOrigin(0.5);
    this.physics.add.existing(this.boxPickup, true);
    this.physics.add.overlap(this.player, this.boxPickup, () => {
      this.collectBox();
    });

    this.notebookPickup = this.add.rectangle(
      notebook.x,
      notebook.y,
      30,
      40,
      0x6dff9f,
    );
    this.notebookPickup.setStrokeStyle(2, 0x42f8ff, 0.9);
    this.notebookLabel = this.add.text(notebook.x, notebook.y - 34, "LIBRETA", {
      color: "#6dff9f",
      fontFamily: "monospace",
      fontSize: "13px",
    });
    this.notebookLabel.setOrigin(0.5);
    this.physics.add.existing(this.notebookPickup, true);
    this.physics.add.overlap(this.player, this.notebookPickup, () => {
      this.collectNotebook();
    });
  }

  // Portatil placeholder: cuando se recoge, desbloquea Pablo Dev.
  private createLaptop() {
    const { x, y } = FIRST_JOURNEY_SECTION.dev.laptop;
    const screen = this.add.rectangle(x, y - 10, 48, 30, 0x0d1230);
    const keyboard = this.add.rectangle(x, y + 12, 60, 12, 0xb8c7ff);
    const glow = this.add.rectangle(x, y + 1, 68, 52, 0x42f8ff, 0.12);
    const label = this.add.text(x, y - 48, "PORTATIL", {
      color: "#42f8ff",
      fontFamily: "monospace",
      fontSize: "13px",
    });

    screen.setStrokeStyle(2, 0x42f8ff, 0.95);
    keyboard.setStrokeStyle(2, 0xf6f7ff, 0.75);
    glow.setStrokeStyle(1, 0xff4fd8, 0.55);
    label.setOrigin(0.5);
    this.laptopVisuals = [glow, screen, keyboard, label];

    this.laptopPickup = this.add.rectangle(x, y, 70, 58, 0xffffff, 0);
    this.physics.add.existing(this.laptopPickup, true);
    this.physics.add.overlap(this.player, this.laptopPickup, () => {
      this.collectLaptop();
    });
  }

  // Meta temporal: al cruzarla pasamos a la pantalla final.
  private createFinishPortal() {
    const { x, y } = FIRST_JOURNEY_SECTION.dev.finish;
    const portal = this.add.graphics();

    portal.lineStyle(5, 0x42f8ff, 0.9);
    portal.strokeRoundedRect(x - 28, y - 48, 56, 96, 16);
    portal.lineStyle(3, 0xff4fd8, 0.9);
    portal.strokeRoundedRect(x - 20, y - 38, 40, 76, 12);
    portal.fillStyle(0x42f8ff, 0.16);
    portal.fillRoundedRect(x - 18, y - 36, 36, 72, 10);

    this.add
      .text(x, y - 64, "META", {
        color: "#ff4fd8",
        fontFamily: "monospace",
        fontSize: "13px",
      })
      .setOrigin(0.5);

    // Zona invisible: detecta que el jugador toca o atraviesa el portal.
    this.finishZone = this.add.rectangle(x, y, 70, 112, 0xffffff, 0);
    this.physics.add.existing(this.finishZone, true);
    this.physics.add.overlap(this.player, this.finishZone, () => {
      this.finishJourney();
    });
  }

  // Genera el bloque despues de recoger la pesa, ya listo para empujarse.
  private createBlock() {
    const { x, y, width, height } = FIRST_JOURNEY_SECTION.block;

    this.block = this.add.rectangle(x, y, width, height, 0x7d4c32);
    this.block.setStrokeStyle(3, 0xffe66d, 0.88);

    this.physics.add.existing(this.block);
    this.blockBody = this.block.body as Phaser.Physics.Arcade.Body;
    this.blockBody.setCollideWorldBounds(true);
    this.blockBody.setDragX(900);

    this.blockLabel = this.add.text(x, y - 48, "PUSH →", {
      color: "#ffe66d",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.blockLabel.setOrigin(0.5);

    // El bloque necesita colisionar con el suelo y con el jugador que lo empuja.
    for (const platform of this.platforms) {
      this.physics.add.collider(this.block, platform);
    }
    this.physics.add.collider(this.player, this.block);
  }

  // Colisiones del jugador con los tramos de suelo y el muro inicial.
  private createCollisions() {
    for (const platform of this.platforms) {
      this.physics.add.collider(this.player, platform);
    }

    // Muro invisible al inicio: el recorrido siempre progresa hacia la derecha.
    const startWall = this.add.rectangle(
      0,
      FIRST_JOURNEY_SECTION.worldHeight / 2,
      24,
      FIRST_JOURNEY_SECTION.worldHeight,
      0xffffff,
      0,
    );
    this.physics.add.existing(startWall, true);
    this.physics.add.collider(this.player, startWall);

  }

  private createControls() {
    this.input.keyboard?.addCapture([
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.menuKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );
  }

  // Movimiento inicial del platformer: flechas y salto con espacio.
  private updatePlayerMovement() {
    if (this.finalDialogueShown) {
      this.playerBody.setVelocityX(0);
      return;
    }

    if (this.cursors.left.isDown) {
      this.playerBody.setVelocityX(-PLAYER_SPEED);
    } else if (this.cursors.right.isDown) {
      this.playerBody.setVelocityX(PLAYER_SPEED);
    } else {
      this.playerBody.setVelocityX(0);
    }

    // Usamos el tiempo interno de Phaser para comparar ventanas de milisegundos.
    const now = this.time.now;

    // Actualizamos el ultimo contacto con suelo, incluyendo el bloque empujable.
    if (this.isPlayerTouchingGround()) {
      this.lastGroundedAt = now;
    }

    // Guardamos la pulsacion de salto aunque Phaser aun no detecte suelo perfecto.
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.lastJumpPressedAt = now;
    }

    // El salto ocurre si se cumplen las dos ventanas: suelo reciente + input reciente.
    if (this.canPlayerJump(now)) {
      this.playerBody.setVelocityY(JUMP_VELOCITY);
      this.lastGroundedAt = Number.NEGATIVE_INFINITY;
      this.lastJumpPressedAt = Number.NEGATIVE_INFINITY;
    }

    if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
      this.returnToMainMenu();
    }
  }

  // Dialogo de la zona 1. Se activa al empezar y solo una vez.
  private showIntroDialogue() {
    if (this.introDialogueShown) {
      return;
    }

    this.introDialogueShown = true;
    this.hud.setStat("curiosity", 1);
    this.showDialogue(JOURNEY_DIALOGUE.intro);
  }

  // Recoger la pesa desbloquea el bloque y transforma visualmente al jugador.
  private collectWeight() {
    if (this.weightCollected) {
      return;
    }

    this.weightCollected = true;
    this.hasWeightPower = true;
    this.hud.setStat("discipline", 1);
    this.weightPickup.destroy();
    this.weightVisuals.forEach((visual) => visual.destroy());

    // Transformacion placeholder: cambia color, borde y escala de Pablito.
    this.player.setFillStyle(0xff4fd8);
    this.player.setStrokeStyle(2, 0xffe66d, 0.95);
    this.tweens.add({
      targets: this.player,
      scaleX: 1.28,
      scaleY: 1.2,
      duration: 160,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.player.setScale(1.12, 1.08),
    });

    // El bloque aparece tras el power-up y nace listo para recibir empujes.
    this.createBlock();

    if (!this.powerUpDialogueShown) {
      this.powerUpDialogueShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.powerUp);
    }
  }

  // Recoger el flotador desbloquea el paso sobre la piscina.
  private collectFloat() {
    if (this.floatCollected) {
      return;
    }

    this.floatCollected = true;
    this.hasFloatPower = true;
    this.hud.setStat("calm", 1);
    this.floatPickup.destroy();
    this.floatVisuals.forEach((visual) => visual.destroy());
    this.createPoolCrossingPlatform();

    // Aro cyan alrededor de Pablito: placeholder de la transformacion socorrista.
    this.floatAura = this.add.graphics();
    this.player.setStrokeStyle(2, 0x42f8ff, 1);

    if (!this.floatDialogueShown) {
      this.floatDialogueShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.floatPower);
    }
  }

  private collectBox() {
    if (this.boxCollected) {
      return;
    }

    this.boxCollected = true;
    this.hasBox = true;
    this.boxPickup.destroy();
    this.boxLabel.destroy();
    this.showDialogue(JOURNEY_DIALOGUE.box);
    this.activateWorkStudyPower();
  }

  private collectNotebook() {
    if (this.notebookCollected) {
      return;
    }

    this.notebookCollected = true;
    this.hasNotebook = true;
    this.notebookPickup.destroy();
    this.notebookLabel.destroy();
    this.showDialogue(JOURNEY_DIALOGUE.notebook);
    this.activateWorkStudyPower();
  }

  // Recoger el portatil activa la transformacion visual final.
  private collectLaptop() {
    if (this.laptopCollected) {
      return;
    }

    this.laptopCollected = true;
    this.hasLaptop = true;
    this.laptopPickup.destroy();
    this.laptopVisuals.forEach((visual) => visual.destroy());
    this.showDialogue(JOURNEY_DIALOGUE.laptop);
    this.activatePabloDevPower();
  }

  // Al reunir trabajo y estudio, el jugador desbloquea un nuevo estado visual.
  private activateWorkStudyPower() {
    if (!this.hasBox || !this.hasNotebook || this.hasWorkStudyPower) {
      return;
    }

    this.hasWorkStudyPower = true;
    this.hud.setStat("organization", 1);
    this.player.setFillStyle(0xffb45b);
    this.player.setStrokeStyle(2, 0xffe66d, 1);
    this.tweens.add({
      targets: this.player,
      scaleX: 1.24,
      scaleY: 1.16,
      duration: 160,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.player.setScale(1.16, 1.1),
    });

    if (!this.workStudyPowerShown) {
      this.workStudyPowerShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.workStudyPower);
    }
  }

  // Estado final del placeholder: Pablo Dev, sin sprite definitivo todavia.
  private activatePabloDevPower() {
    if (!this.hasLaptop || this.isPabloDev) {
      return;
    }

    this.isPabloDev = true;
    this.hud.setStat("dev", 1);
    this.player.setFillStyle(0xf6f7ff);
    this.player.setStrokeStyle(3, 0x42f8ff, 1);
    this.tweens.add({
      targets: this.player,
      scaleX: 1.32,
      scaleY: 1.22,
      duration: 170,
      yoyo: true,
      repeat: 2,
      onComplete: () => this.player.setScale(1.18, 1.1),
    });

    if (!this.pabloDevPowerShown) {
      this.pabloDevPowerShown = true;
      this.time.delayedCall(900, () => {
        this.showDialogue(JOURNEY_DIALOGUE.devPower);
      });
    }
  }

  // Si el bloque cae centrado en el hueco, queda fijo como puente temporal.
  private checkBlockBridge() {
    if (!this.hasWeightPower || this.blockIsBridge) {
      return;
    }

    const distanceToGap = Math.abs(
      this.block.x - FIRST_JOURNEY_SECTION.gap.centerX,
    );
    const blockIsInGap = distanceToGap < FIRST_JOURNEY_SECTION.gap.width * 0.35;

    if (this.blockBody.blocked.down && blockIsInGap) {
      this.blockIsBridge = true;
      this.blockBody.setVelocity(0, 0);
      this.blockBody.setImmovable(true);
      this.block.setFillStyle(0x6dff9f);
      this.blockLabel.setText("PUENTE");
    }
  }

  // Sin flotador, entrar realmente en el agua devuelve al jugador antes de ella.
  private checkPoolRespawn() {
    if (this.hasFloatPower) {
      return;
    }

    const { startX, endX, waterY, safeRespawn } = FIRST_JOURNEY_SECTION.pool;
    const isOverPool =
      this.player.x > startX && this.player.x < endX;
    const hasReachedWater = this.player.y > waterY - 46;

    if (isOverPool && hasReachedWater) {
      this.playerBody.reset(safeRespawn.x, safeRespawn.y);
    }
  }

  // Caer por el hueco devuelve al jugador a un punto seguro antes de el.
  private checkFallRespawn() {
    const hasFallen =
      this.player.y > FIRST_JOURNEY_SECTION.worldHeight + 100 ||
      this.player.x < -40;

    if (!hasFallen) {
      return;
    }

    const hasReachedDevZone = this.player.x >= 4200;
    const hasReachedWorkStudy = this.player.x >= 3250;
    const respawn = hasReachedDevZone
      ? FIRST_JOURNEY_SECTION.dev.safeRespawn
      : hasReachedWorkStudy
        ? FIRST_JOURNEY_SECTION.workStudy.safeRespawn
        : FIRST_JOURNEY_SECTION.safeRespawn;

    this.playerBody.reset(respawn.x, respawn.y);
  }

  // Trigger final de la zona de deporte: se muestra solo una vez al cruzar x 1600.
  private checkSportDialogue() {
    if (
      this.sportDialogueShown ||
      this.player.x < FIRST_JOURNEY_SECTION.sportDialogueTriggerX
    ) {
      return;
    }

    this.sportDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.sport);
  }

  // Trigger final de la zona de socorrista despues de cruzar la piscina.
  private checkLifeguardDialogue() {
    if (
      this.lifeguardDialogueShown ||
      !this.hasFloatPower ||
      this.player.x < FIRST_JOURNEY_SECTION.lifeguardDialogueTriggerX
    ) {
      return;
    }

    this.lifeguardDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.lifeguard);
  }

  // Al llegar a la plataforma superior se cierra la etapa de trabajo + estudio.
  private checkWorkStudyDialogue() {
    if (
      this.workStudyDialogueShown ||
      !this.hasWorkStudyPower ||
      this.player.x < FIRST_JOURNEY_SECTION.workStudy.dialogueTriggerX
    ) {
      return;
    }

    this.workStudyDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.workStudy);
  }

  // Cierre de la zona final: se activa al tocar o atravesar el portal.
  private finishJourney() {
    if (this.finalDialogueShown || !this.isPabloDev) {
      return;
    }

    this.finalDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.final);
    this.playerBody.setVelocity(0, 0);

    // Dejamos ver el ultimo dialogo un momento antes de cambiar de escena.
    this.time.delayedCall(2300, () => {
      this.scene.start("EndScene");
    });
  }

  // Redibuja el aro del flotador alrededor del jugador sin usar sprites finales.
  private updateFloatAura() {
    if (!this.floatAura) {
      return;
    }

    this.floatAura.clear();
    this.floatAura.lineStyle(3, 0x42f8ff, 0.9);
    this.floatAura.strokeCircle(this.player.x, this.player.y + 8, 24);
  }

  private showDialogue(message: string) {
    this.dialogue.show(message);
  }

  private returnToMainMenu() {
    this.scene.start("StartScene");
  }

  // Decide si puede saltar usando coyote time y jump buffer.
  private canPlayerJump(now: number): boolean {
    const hasRecentGroundContact = now - this.lastGroundedAt <= COYOTE_TIME_MS;
    const hasRecentJumpInput = now - this.lastJumpPressedAt <= JUMP_BUFFER_MS;

    return hasRecentGroundContact && hasRecentJumpInput;
  }

  // Detecta suelo normal y tambien apoyo sobre el bloque dinamico.
  private isPlayerTouchingGround(): boolean {
    return (
      this.playerBody.blocked.down ||
      this.playerBody.touching.down ||
      this.isPlayerStandingOnBlock()
    );
  }

  // El bloque empujable puede dar contactos inestables en Arcade Physics.
  // Por eso hacemos una comprobacion geometrica extra cuando el jugador esta encima.
  private isPlayerStandingOnBlock(): boolean {
    if (!this.block?.active || !this.blockBody) {
      return false;
    }

    const playerBounds = this.player.getBounds();
    const blockBounds = this.block.getBounds();
    const hasHorizontalOverlap =
      playerBounds.right > blockBounds.left + 3 &&
      playerBounds.left < blockBounds.right - 3;
    const isPlayerOverBlock =
      playerBounds.bottom >= blockBounds.top - 6 &&
      playerBounds.bottom <= blockBounds.top + 12;
    const isNotMovingUp = this.playerBody.velocity.y >= 0;

    return hasHorizontalOverlap && isPlayerOverBlock && isNotMovingUp;
  }
}
