// Estado narrativo y de recogibles del viaje.
// Separarlo evita que JourneyScene sea solo una lista de booleanos.
export type JourneyState = {
  introDialogueShown: boolean;
  weightCollected: boolean;
  powerUpDialogueShown: boolean;
  sportDialogueShown: boolean;
  floatCollected: boolean;
  floatDialogueShown: boolean;
  lifeguardDialogueShown: boolean;
  hasWorkStudyPower: boolean;
  boxCollected: boolean;
  notebookCollected: boolean;
  workStudyPowerShown: boolean;
  workStudyDialogueShown: boolean;
  laptopCollected: boolean;
  isPabloDev: boolean;
  pabloDevPowerShown: boolean;
  finalDialogueShown: boolean;
  blockIsBridge: boolean;
};

export function createInitialJourneyState(): JourneyState {
  return {
    introDialogueShown: false,
    weightCollected: false,
    powerUpDialogueShown: false,
    sportDialogueShown: false,
    floatCollected: false,
    floatDialogueShown: false,
    lifeguardDialogueShown: false,
    hasWorkStudyPower: false,
    boxCollected: false,
    notebookCollected: false,
    workStudyPowerShown: false,
    workStudyDialogueShown: false,
    laptopCollected: false,
    isPabloDev: false,
    pabloDevPowerShown: false,
    finalDialogueShown: false,
    blockIsBridge: false,
  };
}
