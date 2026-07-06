import type { PortfolioProject } from "../../data/projects";
import { ProjectActionLink } from "./ProjectActionLink";

type ProjectMobileCarouselProps = {
  activeProject: PortfolioProject;
  activeProjectId: string;
  onCelebrate: () => void;
  onConfidential: () => void;
  onSelectProject: (projectId: string) => void;
  projects: PortfolioProject[];
  showAccessDenied: boolean;
};

// Vista exclusiva de movil: un carrusel compacto para no arrastrar la maqueta
// desktop ni sus medidas a pantallas pequenas.
export function ProjectMobileCarousel({
  activeProject,
  activeProjectId,
  onCelebrate,
  onConfidential,
  onSelectProject,
  projects,
  showAccessDenied,
}: ProjectMobileCarouselProps) {
  const activeIndex = Math.max(
    0,
    projects.findIndex((project) => project.id === activeProjectId),
  );
  const previousProject =
    projects[(activeIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(activeIndex + 1) % projects.length];
  const visibleStack = activeProject.stack.slice(0, 5);
  const hiddenStackCount = activeProject.stack.length - visibleStack.length;

  return (
    <section className="projects-mobile-carousel" aria-label="Carrusel de proyectos">
      <div className="projects-mobile-carousel__stage">
        <button
          aria-label="Proyecto anterior"
          className="projects-mobile-carousel__nav projects-mobile-carousel__nav--prev"
          onClick={() => onSelectProject(previousProject.id)}
          type="button"
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        {/* Carrusel visual: solo muestra el cartucho activo. */}
        <div className="projects-mobile-carousel__cartridge" aria-live="polite">
          <p className="projects-mobile-carousel__counter">
            GAME {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>

          <img
            src={activeProject.cartridge.src}
            alt={activeProject.cartridge.alt}
            width="447"
            height="558"
            loading="lazy"
            decoding="async"
          />
        </div>

        <button
          aria-label="Proyecto siguiente"
          className="projects-mobile-carousel__nav projects-mobile-carousel__nav--next"
          onClick={() => onSelectProject(nextProject.id)}
          type="button"
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>

      <div className="projects-mobile-carousel__dots" aria-label="Seleccionar proyecto">
        {projects.map((project, index) => {
          const isActive = project.id === activeProjectId;

          return (
            <button
              aria-current={isActive ? "true" : undefined}
              aria-label={`Seleccionar ${project.label}`}
              className={`projects-mobile-carousel__dot ${
                isActive ? "projects-mobile-carousel__dot--active" : ""
              }`}
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              type="button"
            >
              <span className="sr-only">Proyecto {index + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Panel estatico: cambia de contenido al seleccionar otro cartucho. */}
      <article
        className="projects-mobile-detail"
        aria-label={`Detalle de ${activeProject.label}`}
        aria-live="polite"
      >
        <p className="projects-mobile-detail__label">PROJECT DATA LOADED</p>
        <h3>{activeProject.title}</h3>

        <div className="projects-mobile-detail__copy">
          {activeProject.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div
          className="projects-mobile-detail__stack"
          aria-label={`Stack de ${activeProject.label}`}
        >
          {visibleStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
          {hiddenStackCount > 0 ? <span>+{hiddenStackCount}</span> : null}
        </div>

        <p className="projects-mobile-detail__status">
          <span className="project-status-icon" aria-hidden="true" />
          {activeProject.status}
        </p>

        <div
          className="projects-mobile-carousel__actions"
          aria-label="Acciones del proyecto"
        >
          {activeProject.actions.map((action) => (
            <ProjectActionLink
              action={action}
              key={action.label}
              onCelebrate={onCelebrate}
              onConfidential={onConfidential}
            />
          ))}
        </div>

        {showAccessDenied ? (
          <div className="project-access-alert projects-mobile-carousel__alert" role="alert">
            <p>&gt; show_project</p>
            <strong>ACCESS DENIED</strong>
            <span>Este proyecto contiene informacion confidencial.</span>
          </div>
        ) : null}
      </article>
    </section>
  );
}
