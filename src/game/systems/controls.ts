// Sistema de controles del platformer.
// Guarda el estado temporal del salto tolerante para no inflar JourneyScene.
import Phaser from "phaser";

const PLAYER_SPEED = 240;
const JUMP_VELOCITY = -460;

// Pequenas ayudas de control para que el salto se sienta justo:
// - coyote time: deja saltar un instante despues de perder el suelo.
// - jump buffer: recuerda el salto si se pulsa justo antes de tocar suelo.
const COYOTE_TIME_MS = 140;
const JUMP_BUFFER_MS = 140;

type ControlScene = Phaser.Scene & {
  input: Phaser.Input.InputPlugin;
};

export class PlatformerControls {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey?: Phaser.Input.Keyboard.Key;
  private menuKey?: Phaser.Input.Keyboard.Key;
  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private lastJumpPressedAt = Number.NEGATIVE_INFINITY;

  constructor(private readonly scene: ControlScene) {}

  create() {
    const keyboard = this.scene.input.keyboard;

    // Phaser puede arrancar sin plugin de teclado en entornos no interactivos.
    if (!keyboard) {
      return;
    }

    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
    this.cursors = keyboard.createCursorKeys();
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.menuKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  resetJumpMemory() {
    this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    this.lastJumpPressedAt = Number.NEGATIVE_INFINITY;
  }

  update(config: {
    playerBody: Phaser.Physics.Arcade.Body;
    isTouchingGround: boolean;
    movementLocked: boolean;
    onMenu: () => void;
  }) {
    if (!this.cursors || !this.jumpKey || !this.menuKey) {
      return;
    }

    const { playerBody, isTouchingGround, movementLocked, onMenu } = config;

    if (movementLocked) {
      playerBody.setVelocityX(0);
      return;
    }

    this.updateHorizontalMovement(playerBody);
    this.updateJump(playerBody, isTouchingGround);

    if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
      onMenu();
    }
  }

  private updateHorizontalMovement(playerBody: Phaser.Physics.Arcade.Body) {
    if (!this.cursors) {
      return;
    }

    if (this.cursors.left.isDown) {
      playerBody.setVelocityX(-PLAYER_SPEED);
      return;
    }

    if (this.cursors.right.isDown) {
      playerBody.setVelocityX(PLAYER_SPEED);
      return;
    }

    playerBody.setVelocityX(0);
  }

  private updateJump(
    playerBody: Phaser.Physics.Arcade.Body,
    isTouchingGround: boolean,
  ) {
    if (!this.jumpKey) {
      return;
    }

    const now = this.scene.time.now;

    // Actualizamos el ultimo contacto con suelo, incluyendo apoyos especiales.
    if (isTouchingGround) {
      this.lastGroundedAt = now;
    }

    // Guardamos la pulsacion aunque Phaser aun no detecte suelo perfecto.
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.lastJumpPressedAt = now;
    }

    if (this.canJump(now)) {
      playerBody.setVelocityY(JUMP_VELOCITY);
      this.resetJumpMemory();
    }
  }

  private canJump(now: number): boolean {
    const hasRecentGroundContact = now - this.lastGroundedAt <= COYOTE_TIME_MS;
    const hasRecentJumpInput = now - this.lastJumpPressedAt <= JUMP_BUFFER_MS;

    return hasRecentGroundContact && hasRecentJumpInput;
  }
}
