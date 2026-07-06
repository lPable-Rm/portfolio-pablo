// Primer tramo jugable de Mi viaje con sprites y hitboxes Arcade estables.
import Phaser from "phaser";
import { stopGameMusic } from "../audio/gameMusic";
import { preloadJourneyBackgrounds } from "../assets/journeyBackgrounds";
import { preloadJourneyEnvironmentSprites } from "../assets/journeyEnvironmentSprites";
import { preloadJourneyItemSprites } from "../assets/journeyItemSprites";
import {
  createDevPlatforms,
  createGround,
  createJourneyBackgrounds,
  createPool,
  createWorkStudyPlatforms,
} from "../builders/levelBuilders";
import { JOURNEY_DIALOGUE } from "../data/dialogue";
import { FIRST_JOURNEY_SECTION } from "../data/level";
import {
  createPushBlock,
  syncPushBlockVisual,
  type PushBlockEntity,
} from "../entities/block";
import {
  createFloatPickup,
  createLaptopPickup,
  createWeightPickup,
  createWorkStudyPickups,
} from "../entities/pickups";
import { createFinishPortal, type FinishPortalEntity } from "../entities/portal";
import { PlayerEntity, preloadPlayerAssets } from "../entities/player";
import {
  createInitialJourneyState,
  type JourneyState,
} from "../state/journeyState";
import { PlatformerControls } from "../systems/controls";
import {
  shouldShowLifeguardDialogue,
  shouldShowSportDialogue,
  shouldShowWorkStudyDialogue,
} from "../systems/dialogueTriggers";
import { playPickupFeedback } from "../systems/powerUps";
import {
  respawnIfPlayerEnteredPool,
  respawnIfPlayerFell,
} from "../systems/respawn";
import { DialogueBox } from "../ui/DialogueBox";
import { Hud } from "../ui/Hud";
import { MuteButton } from "../ui/MuteButton";

const POOL_FLOAT_SINK_OFFSET = 40;
const POOL_FLOAT_BOB_AMOUNT = 3;

export class JourneyScene extends Phaser.Scene {
  // Jugador placeholder y su cuerpo fisico Arcade.
  private playerEntity!: PlayerEntity;
  private player!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;

  // Suelo segmentado: deja un hueco entre las dos zonas de plataforma.
  private platforms: Phaser.GameObjects.Rectangle[] = [];

  // Bloque dinamico que se vuelve empujable al recoger la pesa.
  private pushBlock?: PushBlockEntity;
  private block!: Phaser.GameObjects.Rectangle;
  private blockBody!: Phaser.Physics.Arcade.Body;

  // Pesa: una zona fisica invisible y su sprite visual.
  private weightPickup!: Phaser.GameObjects.Rectangle;
  private weightVisuals: Phaser.GameObjects.GameObject[] = [];

  // Flotador y plataforma invisible de agua tras recogerlo.
  private floatPickup!: Phaser.GameObjects.Rectangle;
  private floatVisuals: Phaser.GameObjects.GameObject[] = [];

  // Items de la zona de trabajo + estudio.
  private boxPickup!: Phaser.GameObjects.Rectangle;
  private boxVisuals: Phaser.GameObjects.GameObject[] = [];
  private notebookPickup!: Phaser.GameObjects.Rectangle;
  private notebookVisuals: Phaser.GameObjects.GameObject[] = [];

  // Portatil y meta de la ultima zona.
  private laptopPickup!: Phaser.GameObjects.Rectangle;
  private laptopVisuals: Phaser.GameObjects.GameObject[] = [];
  private finishPortal!: FinishPortalEntity;
  private finishZone!: Phaser.GameObjects.Rectangle;

  // Elementos de interfaz y teclado.
  private dialogue!: DialogueBox;
  private hud!: Hud;
  private controls!: PlatformerControls;
  private muteButton?: MuteButton;

  // Estado narrativo, power-ups y recogibles de la partida actual.
  private state!: JourneyState;

  constructor() {
    super("JourneyScene");
  }

  // Cargamos los sprites temporales del jugador desde public/assets.
  preload() {
    preloadJourneyBackgrounds(this);
    preloadJourneyEnvironmentSprites(this);
    preloadPlayerAssets(this);
    preloadJourneyItemSprites(this);
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

    createJourneyBackgrounds(this);
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
    this.muteButton = new MuteButton(this);
    this.showIntroDialogue();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  // Phaser llama a update en cada fotograma.
  update() {
    this.updatePlayerMovement();
    this.updatePlayerSprite();
    this.updateBlockVisual();
    this.checkBlockBridge();
    this.checkPoolRespawn();
    this.checkFallRespawn();
    this.checkSportDialogue();
    this.checkLifeguardDialogue();
    this.checkWorkStudyDialogue();
    this.muteButton?.update();
  }

  // Phaser reutiliza la misma instancia de Scene al reiniciar.
  // Por eso limpiamos estados y arrays antes de reconstruir el nivel.
  private resetState() {
    this.platforms = [];
    this.weightVisuals = [];
    this.floatVisuals = [];
    this.boxVisuals = [];
    this.notebookVisuals = [];
    this.laptopVisuals = [];
    this.pushBlock = undefined;
    this.state = createInitialJourneyState();
    this.controls = new PlatformerControls(this);
  }

  // Pablito pequeno: una forma temporal hasta disponer de su spritesheet.
  private createPlayer() {
    this.playerEntity = new PlayerEntity(
      this,
      FIRST_JOURNEY_SECTION.playerStart,
    );
    this.player = this.playerEntity.bodyObject;
    this.playerBody = this.playerEntity.body;
  }

  // Mantiene el sprite visual pegado al cuerpo fisico invisible y cambia animacion.
  private updatePlayerSprite() {
    this.playerEntity.update(this.isPlayerTouchingGround());
    this.playerEntity.sprite.y += this.getPoolFloatBobOffset();
  }

  // La pesa usa sprite; el rectangulo invisible detecta la recogida.
  private createWeight() {
    const weight = createWeightPickup(this, this.player, () => {
      this.collectWeight();
    });

    this.weightPickup = weight.pickup;
    this.weightVisuals = weight.visuals;
  }

  // Flotador con sprite y una zona de overlap transparente.
  private createFloat() {
    const float = createFloatPickup(this, this.player, () => {
      this.collectFloat();
    });

    this.floatPickup = float.pickup;
    this.floatVisuals = float.visuals;
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
    const workStudy = createWorkStudyPickups(
      this,
      this.player,
      () => {
        this.collectBox();
      },
      () => {
        this.collectNotebook();
      },
    );

    this.boxPickup = workStudy.boxPickup;
    this.boxVisuals = workStudy.boxVisuals;
    this.notebookPickup = workStudy.notebookPickup;
    this.notebookVisuals = workStudy.notebookVisuals;
  }

  // Portatil con sprite: cuando se recoge, desbloquea Pablo Dev.
  private createLaptop() {
    const laptop = createLaptopPickup(this, this.player, () => {
      this.collectLaptop();
    });

    this.laptopPickup = laptop.pickup;
    this.laptopVisuals = laptop.visuals;
  }

  // Meta temporal: al cruzarla pasamos a la pantalla final.
  private createFinishPortal() {
    this.finishPortal = createFinishPortal(this, this.player, () => {
      this.finishJourney();
    });
    this.finishZone = this.finishPortal.zone;
  }

  // Genera el bloque despues de recoger la pesa, ya listo para empujarse.
  private createBlock() {
    const pushBlock = createPushBlock(this, this.player, this.platforms);

    this.pushBlock = pushBlock;
    this.block = pushBlock.block;
    this.blockBody = pushBlock.body;
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
    this.controls.create();
  }

  // Movimiento inicial del platformer: flechas y salto con espacio.
  private updatePlayerMovement() {
    this.controls.update({
      playerBody: this.playerBody,
      isTouchingGround: this.isPlayerTouchingGround(),
      movementLocked: this.state.finalDialogueShown,
      onMenu: () => {
        this.returnToMainMenu();
      },
    });
  }

  // Dialogo de la zona 1. Se activa al empezar y solo una vez.
  private showIntroDialogue() {
    if (this.state.introDialogueShown) {
      return;
    }

    this.state.introDialogueShown = true;
    this.hud.setStat("curiosity", 1);
    this.showDialogue(JOURNEY_DIALOGUE.intro);
  }

  // Recoger la pesa desbloquea el bloque y transforma visualmente al jugador.
  private collectWeight() {
    if (this.state.weightCollected) {
      return;
    }

    this.state.weightCollected = true;
    this.hud.setStat("discipline", 1);
    this.weightPickup.destroy();
    this.showPickupFeedback("DISCIPLINA", 0xffe66d, this.weightVisuals);

    // El bloque aparece tras el power-up y nace listo para recibir empujes.
    this.createBlock();

    if (!this.state.powerUpDialogueShown) {
      this.state.powerUpDialogueShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.powerUp);
    }
  }

  // Recoger el flotador desbloquea el paso sobre la piscina.
  private collectFloat() {
    if (this.state.floatCollected) {
      return;
    }

    this.state.floatCollected = true;
    this.hud.setStat("calm", 1);
    this.floatPickup.destroy();
    this.showPickupFeedback("CALMA", 0x42f8ff, this.floatVisuals);
    this.createPoolCrossingPlatform();

    if (!this.state.floatDialogueShown) {
      this.state.floatDialogueShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.floatPower);
    }
  }

  private collectBox() {
    if (this.state.boxCollected) {
      return;
    }

    this.state.boxCollected = true;
    this.boxPickup.destroy();
    this.showPickupFeedback(
      this.state.notebookCollected ? "ORGANIZACION" : "TRABAJO",
      0xffb45b,
      this.boxVisuals,
    );
    this.activateWorkStudyPower();
  }

  private collectNotebook() {
    if (this.state.notebookCollected) {
      return;
    }

    this.state.notebookCollected = true;
    this.notebookPickup.destroy();
    this.showPickupFeedback(
      this.state.boxCollected ? "ORGANIZACION" : "ESTUDIO",
      0xffb45b,
      this.notebookVisuals,
    );
    this.activateWorkStudyPower();
  }

  // Recoger el portatil activa la transformacion visual final.
  private collectLaptop() {
    if (this.state.laptopCollected) {
      return;
    }

    this.state.laptopCollected = true;
    this.laptopPickup.destroy();
    this.showPickupFeedback("DEV", 0x42f8ff, this.laptopVisuals);
    this.activatePabloDevPower();
  }

  // Al reunir trabajo y estudio, el jugador desbloquea un nuevo estado visual.
  private activateWorkStudyPower() {
    if (
      !this.state.boxCollected ||
      !this.state.notebookCollected ||
      this.state.hasWorkStudyPower
    ) {
      return;
    }

    this.state.hasWorkStudyPower = true;
    this.hud.setStat("organization", 1);

    if (!this.state.workStudyPowerShown) {
      this.state.workStudyPowerShown = true;
      this.showDialogue(JOURNEY_DIALOGUE.workStudyPower);
    }
  }

  // Estado final del placeholder: Pablo Dev, sin sprite definitivo todavia.
  private activatePabloDevPower() {
    if (!this.state.laptopCollected || this.state.isPabloDev) {
      return;
    }

    this.state.isPabloDev = true;
    this.hud.setStat("dev", 1);

    if (!this.state.pabloDevPowerShown) {
      this.state.pabloDevPowerShown = true;
      this.time.delayedCall(900, () => {
        this.showDialogue(JOURNEY_DIALOGUE.devPower);
      });
    }
  }

  // Si el bloque cae centrado en el hueco, queda fijo como puente temporal.
  private checkBlockBridge() {
    if (!this.state.weightCollected || this.state.blockIsBridge) {
      return;
    }

    const distanceToGap = Math.abs(
      this.block.x - FIRST_JOURNEY_SECTION.gap.centerX,
    );
    const blockIsInGap = distanceToGap < FIRST_JOURNEY_SECTION.gap.width * 0.35;

    if (this.blockBody.blocked.down && blockIsInGap) {
      this.state.blockIsBridge = true;
      this.blockBody.setVelocity(0, 0);
      this.blockBody.setImmovable(true);
      this.block.setFillStyle(0x6dff9f);
    }
  }

  // Mantiene el sprite del bloque pegado a la hitbox fisica invisible.
  private updateBlockVisual() {
    if (!this.pushBlock) {
      return;
    }

    syncPushBlockVisual(this.pushBlock);
  }

  // Sin flotador, entrar realmente en el agua devuelve al jugador antes de ella.
  private checkPoolRespawn() {
    respawnIfPlayerEnteredPool(
      this.player,
      this.playerBody,
      this.state.floatCollected,
    );
  }

  // Caer por el hueco devuelve al jugador a un punto seguro antes de el.
  private checkFallRespawn() {
    respawnIfPlayerFell(this.player, this.playerBody);
  }

  // Trigger final de la zona de deporte: se muestra solo una vez al cruzar x 1600.
  private checkSportDialogue() {
    if (
      !shouldShowSportDialogue(this.player.x, this.state.sportDialogueShown)
    ) {
      return;
    }

    this.state.sportDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.sport);
  }

  // Trigger final de la zona de socorrista despues de cruzar la piscina.
  private checkLifeguardDialogue() {
    if (
      !shouldShowLifeguardDialogue(
        this.player.x,
        this.state.lifeguardDialogueShown,
        this.state.floatCollected,
      )
    ) {
      return;
    }

    this.state.lifeguardDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.lifeguard);
  }

  // Al llegar a la plataforma superior se cierra la etapa de trabajo + estudio.
  private checkWorkStudyDialogue() {
    if (
      !shouldShowWorkStudyDialogue(
        this.player.x,
        this.state.workStudyDialogueShown,
        this.state.hasWorkStudyPower,
      )
    ) {
      return;
    }

    this.state.workStudyDialogueShown = true;
    this.showDialogue(JOURNEY_DIALOGUE.workStudy);
  }

  // Cierre de la zona final: se activa al tocar o atravesar el portal.
  private finishJourney() {
    if (this.state.finalDialogueShown || !this.state.isPabloDev) {
      return;
    }

    // Solo entra al tocar la boca desde arriba o cayendo, no al cruzarla subiendo.
    if (this.playerBody.velocity.y < -20) {
      return;
    }

    this.state.finalDialogueShown = true;
    this.dialogue.clear();
    this.playPipeExitAnimation();
  }

  // Efecto tipo tuberia: Pablito se centra, baja dentro y cambiamos de escena.
  private playPipeExitAnimation() {
    const entryY =
      this.finishPortal.zone.y - this.player.displayHeight / 2 + 2;
    const sinkY = entryY + 86;

    this.playerBody.setVelocity(0, 0);
    this.playerBody.setAllowGravity(false);
    this.playerBody.enable = false;
    this.playerEntity.sprite.stop();
    this.playerEntity.sprite.setFlipX(false);

    this.tweens.add({
      targets: this.player,
      x: this.finishPortal.zone.x,
      y: entryY,
      duration: 260,
      ease: "Sine.easeOut",
      onComplete: () => {
        // La tuberia queda delante para que parezca que Pablito entra dentro.
        this.playerEntity.sprite.setDepth(6);
        this.cameras.main.shake(220, 0.002);

        this.tweens.add({
          targets: this.finishPortal.visual,
          scaleX: 0.35,
          scaleY: 0.35,
          duration: 120,
          yoyo: true,
          repeat: 2,
        });

        this.tweens.add({
          targets: this.player,
          y: sinkY,
          duration: 520,
          ease: "Sine.easeIn",
        });

        this.tweens.add({
          targets: this.playerEntity.sprite,
          alpha: 0,
          delay: 160,
          duration: 360,
          ease: "Sine.easeIn",
        });
      },
    });

    this.time.delayedCall(980, () => {
      this.scene.start("EndScene");
    });
  }

  // Movimiento visual suave al cruzar la piscina con el flotador activo.
  private getPoolFloatBobOffset(): number {
    if (!this.state.floatCollected || !this.isPlayerOverPool()) {
      return 0;
    }

    // Hundimos solo el sprite para que parezca que flota dentro del agua.
    return (
      POOL_FLOAT_SINK_OFFSET +
      Math.sin(this.time.now / 160) * POOL_FLOAT_BOB_AMOUNT
    );
  }

  private isPlayerOverPool(): boolean {
    const { startX, endX } = FIRST_JOURNEY_SECTION.pool;

    return this.player.x > startX && this.player.x < endX;
  }

  private showPickupFeedback(
    label: string,
    sparkColor: number,
    visuals: Phaser.GameObjects.GameObject[],
  ) {
    playPickupFeedback(this, this.player, {
      label,
      sparkColor,
      playerSprite: this.playerEntity.sprite,
      visuals,
    });
  }

  private showDialogue(message: string) {
    this.dialogue.show(message);
  }

  private returnToMainMenu() {
    stopGameMusic(this);
    this.scene.start("StartScene");
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
