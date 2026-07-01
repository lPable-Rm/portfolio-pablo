// Condiciones de avance narrativo del nivel.
// Devuelven booleanos puros para que JourneyScene conserve el control del estado.
import { FIRST_JOURNEY_SECTION } from "../data/level";

export function shouldShowSportDialogue(
  playerX: number,
  alreadyShown: boolean,
) {
  return (
    !alreadyShown && playerX >= FIRST_JOURNEY_SECTION.sportDialogueTriggerX
  );
}

export function shouldShowLifeguardDialogue(
  playerX: number,
  alreadyShown: boolean,
  hasFloatPower: boolean,
) {
  return (
    !alreadyShown &&
    hasFloatPower &&
    playerX >= FIRST_JOURNEY_SECTION.lifeguardDialogueTriggerX
  );
}

export function shouldShowWorkStudyDialogue(
  playerX: number,
  alreadyShown: boolean,
  hasWorkStudyPower: boolean,
) {
  return (
    !alreadyShown &&
    hasWorkStudyPower &&
    playerX >= FIRST_JOURNEY_SECTION.workStudy.dialogueTriggerX
  );
}
