// Estado narrativo y de recogibles del viaje.
// Separarlo evita que JourneyScene sea solo una lista de booleanos.
export type JourneyState = {
  introDialogueShown: boolean;
  hasWeightPower: boolean;
  weightCollected: boolean;
  powerUpDialogueShown: boolean;
  sportDialogueShown: boolean;
  hasFloatPower: boolean;
  floatCollected: boolean;
  floatDialogueShown: boolean;
  lifeguardDialogueShown: boolean;
  hasBox: boolean;
  hasNotebook: boolean;
  hasWorkStudyPower: boolean;
  boxCollected: boolean;
  notebookCollected: boolean;
  workStudyPowerShown: boolean;
  workStudyDialogueShown: boolean;
  hasLaptop: boolean;
  laptopCollected: boolean;
  isPabloDev: boolean;
  pabloDevPowerShown: boolean;
  finalDialogueShown: boolean;
  blockIsBridge: boolean;
};

export function createInitialJourneyState(): JourneyState {
  return {
    introDialogueShown: false,
    hasWeightPower: false,
    weightCollected: false,
    powerUpDialogueShown: false,
    sportDialogueShown: false,
    hasFloatPower: false,
    floatCollected: false,
    floatDialogueShown: false,
    lifeguardDialogueShown: false,
    hasBox: false,
    hasNotebook: false,
    hasWorkStudyPower: false,
    boxCollected: false,
    notebookCollected: false,
    workStudyPowerShown: false,
    workStudyDialogueShown: false,
    hasLaptop: false,
    laptopCollected: false,
    isPabloDev: false,
    pabloDevPowerShown: false,
    finalDialogueShown: false,
    blockIsBridge: false,
  };
}
