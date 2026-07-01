// Musica global del mini juego.
// Se guarda en el SoundManager para sobrevivir al cambio entre escenas.
import Phaser from "phaser";

const GAME_MUSIC_KEY = "journey-cyberpunk-theme";
const GAME_MUSIC_URL = "/assets/audio/cyberpunkMusic.mp3";
const GAME_MUSIC_VOLUME = 0.2;
const GAME_MUSIC_MUTED_KEY = "journey-music-muted";

type GameMusicSound = Phaser.Sound.BaseSound & {
  setMute(value: boolean): GameMusicSound;
  setVolume(value: number): GameMusicSound;
};

export function preloadGameMusic(scene: Phaser.Scene) {
  if (scene.cache.audio.exists(GAME_MUSIC_KEY)) {
    return;
  }

  scene.load.audio(GAME_MUSIC_KEY, GAME_MUSIC_URL);
}

export function startGameMusic(scene: Phaser.Scene) {
  const music = getOrCreateGameMusic(scene);

  syncGameMusicMute(scene);

  // El play se lanza desde ENTER/click en StartScene para respetar el navegador.
  if (!music.isPlaying) {
    music.play({
      loop: true,
      volume: GAME_MUSIC_VOLUME,
    });
  }

  syncGameMusicMute(scene);
}

export function stopGameMusic(scene: Phaser.Scene) {
  const music = getExistingGameMusic(scene);

  if (!music || (!music.isPlaying && !music.isPaused)) {
    return;
  }

  music.stop();
}

export function isGameMusicMuted(scene: Phaser.Scene): boolean {
  return scene.registry.get(GAME_MUSIC_MUTED_KEY) === true;
}

export function toggleGameMusicMuted(scene: Phaser.Scene): boolean {
  const nextMuted = !isGameMusicMuted(scene);

  scene.registry.set(GAME_MUSIC_MUTED_KEY, nextMuted);
  syncGameMusicMute(scene);

  return nextMuted;
}

function syncGameMusicMute(scene: Phaser.Scene) {
  const music = getExistingGameMusic(scene);

  if (!music) {
    return;
  }

  music.setVolume(GAME_MUSIC_VOLUME);
  music.setMute(isGameMusicMuted(scene));
}

function getOrCreateGameMusic(scene: Phaser.Scene): GameMusicSound {
  const existingMusic = getExistingGameMusic(scene);

  if (existingMusic) {
    return existingMusic;
  }

  return scene.sound.add(GAME_MUSIC_KEY, {
    loop: true,
    volume: GAME_MUSIC_VOLUME,
  }) as GameMusicSound;
}

function getExistingGameMusic(scene: Phaser.Scene): GameMusicSound | null {
  const music = scene.sound.get<GameMusicSound>(
    GAME_MUSIC_KEY,
  ) as GameMusicSound | null;

  if (!music || music.pendingRemove) {
    return null;
  }

  return music;
}
