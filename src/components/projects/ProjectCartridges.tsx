import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { projects } from "../../data/projects";
import { ProjectActionLink } from "./ProjectActionLink";
import { ProjectMobileCarousel } from "./ProjectMobileCarousel";

type ConfettiPiece = {
  color: string;
  delay: number;
  drift: number;
  duration: number;
  id: number;
  left: number;
  size: number;
};

export default function ProjectCartridges() {
  // Proyecto seleccionado por defecto: el primero de la lista.
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);

  // Piezas temporales de confeti. Cuando el array tiene contenido, se pintan
  // en una capa fija sobre la pantalla y CSS se encarga de la animacion.
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  // Solo se usa en el proyecto Data Analyst al pulsar "Mostrar".
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Guarda el timeout para poder cancelar una animacion si el usuario pulsa
  // varias veces o cambia de cartucho antes de que termine.
  const confettiTimeout = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  // Deriva el proyecto completo desde el id activo. Si algo falla, vuelve al
  // primer proyecto para que el panel nunca quede sin datos.
  const activeProject = useMemo(
    () =>
      projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId],
  );

  const activeProjectIndex = Math.max(
    0,
    projects.findIndex((project) => project.id === activeProject.id),
  );
  const previousProject =
    projects[(activeProjectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(activeProjectIndex + 1) % projects.length];
  const desktopCarouselProjects = [
    previousProject,
    activeProject,
    nextProject,
  ];

  const selectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setConfettiPieces([]);
    setShowAccessDenied(false);
  };

  // Genera piezas con valores deterministicos: color, posicion, retraso,
  // desplazamiento lateral y duracion. Esto evita depender de librerias.
  const launchConfetti = () => {
    const colors = ["#42f8ff", "#ff4fd8", "#ffe66d", "#8f6bff", "#6dff9f"];

    if (confettiTimeout.current) {
      window.clearTimeout(confettiTimeout.current);
    }

    setShowAccessDenied(false);
    setConfettiPieces(
      Array.from({ length: 140 }, (_, index) => ({
        color: colors[index % colors.length],
        delay: (index % 20) * 0.035,
        drift: ((index * 37) % 181) - 90,
        duration: 1.55 + (index % 10) * 0.075,
        id: Date.now() + index,
        left: (index * 11) % 100,
        size: 5 + (index % 4) * 2,
      })),
    );

    confettiTimeout.current = window.setTimeout(() => {
      setConfettiPieces([]);
      confettiTimeout.current = null;
    }, 2600);
  };

  useEffect(
    // Limpia el timeout si React desmonta el componente.
    () => () => {
      if (confettiTimeout.current) {
        window.clearTimeout(confettiTimeout.current);
      }
    },
    [],
  );

  return (
    <>
      {confettiPieces.length > 0 ? (
        // Capa decorativa: aria-hidden porque no aporta información semántica.
        <div className="project-confetti-layer" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              className="project-confetti-piece"
              key={piece.id}
              style={
                {
                  "--confetti-color": piece.color,
                  "--confetti-delay": `${piece.delay}s`,
                  "--confetti-drift": `${piece.drift}px`,
                  "--confetti-duration": `${piece.duration}s`,
                  "--confetti-left": `${piece.left}%`,
                  "--confetti-size": `${piece.size}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {/* Vista desktop: carrusel circular de tres cartuchos y panel inferior. */}
      <div className="projects-desktop-view">
        <div
          className="projects-desktop-carousel"
          role="group"
          aria-label="Carrusel de proyectos destacados"
        >
          <p className="projects-desktop-carousel__counter" aria-live="polite">
            GAME {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>

          <button
            aria-controls="project-detail-panel"
            aria-label={`Proyecto anterior: ${previousProject.label}`}
            className="projects-desktop-carousel__nav projects-desktop-carousel__nav--prev"
            onClick={() => selectProject(previousProject.id)}
            type="button"
          >
            <span aria-hidden="true">&lt;</span>
          </button>

          <div
            className="cartridge-grid"
            role="group"
            aria-label="Proyectos visibles"
          >
            {desktopCarouselProjects.map((project) => {
              const isActive = project.id === activeProject.id;

              return (
                // Los laterales tambien son botones y llevan su proyecto al centro.
                <button
                  aria-controls="project-detail-panel"
                  aria-pressed={isActive}
                  className={`cartridge-card cartridge-card--image ${
                    isActive
                      ? "cartridge-card--active"
                      : "cartridge-card--side"
                  }`}
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  type="button"
                >
                  <img
                    className="cartridge-image"
                    src={project.cartridge.src}
                    alt={project.cartridge.alt}
                    width="447"
                    height="558"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="sr-only">
                    {isActive ? "Proyecto seleccionado" : "Seleccionar proyecto"}{" "}
                    {project.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            aria-controls="project-detail-panel"
            aria-label={`Proyecto siguiente: ${nextProject.label}`}
            className="projects-desktop-carousel__nav projects-desktop-carousel__nav--next"
            onClick={() => selectProject(nextProject.id)}
            type="button"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>

        <article
          id="project-detail-panel"
          className="project-detail-panel"
          aria-label="Detalle del proyecto seleccionado"
          aria-live="polite"
        >
          <div className="project-detail-preview">
            <img
              src={activeProject.cartridge.src}
              alt={`Vista del proyecto ${activeProject.label}`}
              width="447"
              height="558"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="project-detail-copy">
            <p className="pixel-label">PROJECT DATA LOADED</p>
            <h3>{activeProject.title}</h3>
            {activeProject.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="project-detail-meta">
            <div>
              <p className="project-detail-kicker">
                <span className="project-detail-kicker-icon" aria-hidden="true" />
                Stack:
              </p>
              <p>{activeProject.stack.join(" / ")}</p>
            </div>
            <p className="project-status">
              <span className="project-status-icon" aria-hidden="true" />
              {activeProject.status}
            </p>
            {showAccessDenied ? (
              <div className="project-access-alert" role="alert">
                <p>&gt; show_project</p>
                <strong>ACCESS DENIED</strong>
                <span>Este proyecto contiene información confidencial.</span>
              </div>
            ) : null}
          </div>

          <div className="project-detail-actions" aria-label="Acciones del proyecto">
            {activeProject.actions.map((action) => (
              <ProjectActionLink
                action={action}
                key={action.label}
                onCelebrate={launchConfetti}
                onConfidential={() => setShowAccessDenied(true)}
              />
            ))}
          </div>
        </article>
      </div>

      <ProjectMobileCarousel
        activeProject={activeProject}
        activeProjectId={activeProjectId}
        onCelebrate={launchConfetti}
        onConfidential={() => setShowAccessDenied(true)}
        onSelectProject={selectProject}
        projects={projects}
        showAccessDenied={showAccessDenied}
      />
    </>
  );
}
