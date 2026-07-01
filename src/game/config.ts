// Configuracion compartida por todas las escenas del mini juego.
export const GAME_SIZE = {
  width: 960,
  height: 540,
} as const;

export const JOURNEY_BACKGROUND = {
  key: "journey-background",
  url: "/assets/backgrounds/fondoSeccionMiviaje.png",
} as const;

export const START_SCREEN_BACKGROUND = {
  key: "start-screen-background",
  url: "/assets/images/fondoPantallaInicioGame.png",
} as const;

export const CV_FILE = {
  url: "/assets/cv/CV_PabloRamosMelianLite.pdf",
  fileName: "CV_PabloRamosMelianLite.pdf",
} as const;
