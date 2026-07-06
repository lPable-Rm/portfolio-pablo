// Estado tactil externo al canvas: la carcasa HTML emite eventos y Phaser los lee.
import Phaser from "phaser";

export type TouchControlState = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

type TouchControlName = keyof TouchControlState;

type TouchControlEventDetail = {
  control: TouchControlName;
  isPressed: boolean;
};

const TOUCH_CONTROL_EVENT = "pablo-game-touch-control";

export class TouchControls {
  private state: TouchControlState = {
    left: false,
    right: false,
    jump: false,
  };

  private readonly onTouchControl = (event: Event) => {
    const customEvent = event as CustomEvent<TouchControlEventDetail>;
    const { control, isPressed } = customEvent.detail ?? {};

    if (!control || !(control in this.state)) {
      return;
    }

    this.state[control] = isPressed;
  };

  constructor(private readonly scene: Phaser.Scene) {}

  create() {
    window.addEventListener(TOUCH_CONTROL_EVENT, this.onTouchControl);
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
    this.scene.events.once(Phaser.Scenes.Events.DESTROY, this.destroy, this);
  }

  getState(): TouchControlState {
    return { ...this.state };
  }

  destroy() {
    window.removeEventListener(TOUCH_CONTROL_EVENT, this.onTouchControl);
    this.state.left = false;
    this.state.right = false;
    this.state.jump = false;
  }
}
