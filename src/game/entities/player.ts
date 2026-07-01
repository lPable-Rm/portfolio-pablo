// Entidad visual/fisica de Pablito durante el tramo jugable.
import Phaser from "phaser";

type ArcadeScene = Phaser.Scene & {
  physics: Phaser.Physics.Arcade.ArcadePhysics;
};

type PlayerFrame = {
  key: string;
  url: string;
};

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

const PLAYER_FRAMES = [
  ...PABLITO_SMALL_IDLE_FRAMES,
  ...PABLITO_SMALL_WALK_FRAMES,
  PABLITO_SMALL_JUMP_FRAME,
  PABLITO_SMALL_FALL_FRAME,
];

export function preloadPlayerAssets(scene: Phaser.Scene) {
  for (const frame of PLAYER_FRAMES) {
    if (!scene.textures.exists(frame.key)) {
      scene.load.image(frame.key, frame.url);
    }
  }
}

export class PlayerEntity {
  readonly bodyObject: Phaser.GameObjects.Rectangle;
  readonly body: Phaser.Physics.Arcade.Body;
  readonly sprite: Phaser.GameObjects.Sprite;

  constructor(
    private readonly scene: ArcadeScene,
    start: { x: number; y: number },
  ) {
    // El rectangulo invisible conserva la fisica estable del prototipo.
    this.bodyObject = scene.add.rectangle(start.x, start.y, 28, 44, 0x42f8ff);
    this.bodyObject.setStrokeStyle(2, 0xf6f7ff, 0.85);

    scene.physics.add.existing(this.bodyObject);
    this.body = this.bodyObject.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(false);
    this.bodyObject.setVisible(false);

    this.createAnimation(
      PABLITO_SMALL_IDLE_ANIMATION,
      PABLITO_SMALL_IDLE_FRAMES,
      3,
    );
    this.createAnimation(
      PABLITO_SMALL_WALK_ANIMATION,
      PABLITO_SMALL_WALK_FRAMES,
      8,
    );

    this.sprite = scene.add
      .sprite(this.bodyObject.x, this.getFeetY(), "pablito-small-idle-1")
      .setOrigin(0.5, 1)
      .setScale(PLAYER_SPRITE_SCALE)
      .setDepth(5);

    this.sprite.play(PABLITO_SMALL_IDLE_ANIMATION);
  }

  update(isTouchingGround: boolean) {
    this.sprite.setPosition(this.bodyObject.x, this.getFeetY());
    this.updateAnimation(isTouchingGround);

    // El sprite original mira a la derecha; al movernos a la izquierda lo invertimos.
    if (this.body.velocity.x !== 0) {
      this.sprite.setFlipX(this.body.velocity.x < 0);
    }
  }

  private createAnimation(
    key: string,
    frames: PlayerFrame[],
    frameRate: number,
  ) {
    if (this.scene.anims.exists(key)) {
      return;
    }

    this.scene.anims.create({
      key,
      frames: frames.map((frame) => ({ key: frame.key })),
      frameRate,
      repeat: -1,
    });
  }

  private updateAnimation(isTouchingGround: boolean) {
    const isJumping = this.body.velocity.y < -20;
    const isFalling = this.body.velocity.y > 20 && !isTouchingGround;

    if (isJumping) {
      this.sprite.stop();
      this.sprite.setTexture(PABLITO_SMALL_JUMP_FRAME.key);
      return;
    }

    if (isFalling) {
      this.sprite.stop();
      this.sprite.setTexture(PABLITO_SMALL_FALL_FRAME.key);
      return;
    }

    const isWalking = Math.abs(this.body.velocity.x) > 5 && isTouchingGround;
    const nextAnimation = isWalking
      ? PABLITO_SMALL_WALK_ANIMATION
      : PABLITO_SMALL_IDLE_ANIMATION;
    const currentAnimation = this.sprite.anims.currentAnim?.key;
    const animationIsStopped = !this.sprite.anims.isPlaying;

    // Si venimos de jump/fall, la animacion esta parada aunque currentAnim
    // pueda seguir apuntando a idle/walk. Por eso tambien comprobamos isPlaying.
    if (animationIsStopped || currentAnimation !== nextAnimation) {
      this.sprite.play(nextAnimation);
    }
  }

  private getFeetY(): number {
    return this.bodyObject.y + this.bodyObject.displayHeight / 2;
  }
}
