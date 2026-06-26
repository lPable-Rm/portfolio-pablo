// Hook de React para ejecutar código al mostrar/desmontar el componente
// y para guardar una referencia a un elemento HTML.
import { useEffect, useRef } from "react";

// Importa solo el tipo de Phaser.
// No añade Phaser al JavaScript inicial de la página.
import type Phaser from "phaser";

// `default` permite importarlo con el nombre que elijamos:
// import GameWrapper from "...";
export default function GameWrapper() {
  // Guarda una referencia al <div> donde Phaser insertará el canvas.
  // Al principio vale `null` porque el div todavía no existe en el navegador.
  const containerRef = useRef<HTMLDivElement>(null);

  // Se ejecuta después de que React pinte el componente en el navegador.
  useEffect(() => {
    // Guardará la instancia del juego cuando Phaser se haya creado.
    // Puede ser `undefined` mientras el juego aún no está listo.
    let game: Phaser.Game | undefined;

    // Evita crear el juego si el componente se desmonta
    // mientras se está cargando main.ts.
    let isUnmounted = false;

    // Es async porque usaremos `await` para cargar main.ts dinámicamente.
    async function startGame() {
      // Recuperamos el div real guardado en la referencia.
      const container = containerRef.current;

      // Si por algún motivo el div no existe, detenemos la función.
      if (!container) {
        return;
      }

      // Carga el módulo del juego solo cuando se necesita.
      // `createGame` será una función que escribiremos en main.ts.
      const { createGame } = await import("../../game/main");

      // Si React desmontó el componente durante la carga, no creamos Phaser.
      if (isUnmounted) {
        return;
      }

      // Crea el juego dentro del div y guarda su instancia.
      game = createGame(container);
    }

    // Inicia la función async.
    // `void` indica que no necesitamos usar la Promise que devuelve.
    void startGame();

    // React ejecuta esta función cuando el componente desaparece.
    return () => {
      // Marca que este componente ya no debe iniciar Phaser.
      isUnmounted = true;

      // Destruye el juego si existe.
      // El `true` elimina también el canvas creado por Phaser.
      game?.destroy(true);
    };
  }, []); // [] significa: ejecutar este efecto una vez al montar el componente.

  // Este div es el contenedor físico del canvas de Phaser.
  return (
    <div
      ref={containerRef}
      className="game-container"
      role="application"
      aria-label="Mini juego interactivo sobre el viaje de Pablo"
    />
  );
}