import type { ProjectAction } from "../../data/projects";

type ProjectActionLinkProps = {
  action: ProjectAction;
  onCelebrate: () => void;
  onConfidential: () => void;
};

// Boton/enlace comun para desktop y movil. Centralizarlo evita que cada vista
// tenga una version distinta de "Ver demo", GitHub, Hiring o acceso denegado.
export function ProjectActionLink({
  action,
  onCelebrate,
  onConfidential,
}: ProjectActionLinkProps) {
  const className = `project-action ${
    action.variant === "primary" ? "project-action--primary" : ""
  }`;

  if (action.kind === "confidential") {
    return (
      <button className={className} type="button" onClick={onConfidential}>
        <span className="project-action-icon" aria-hidden="true" />
        {action.label}
      </button>
    );
  }

  if (action.kind === "celebrate") {
    return (
      <button className={className} type="button" onClick={onCelebrate}>
        <span className="project-action-icon" aria-hidden="true" />
        {action.label}
      </button>
    );
  }

  const href = action.href ?? "#";
  const isExternalLink = href.startsWith("http");

  return (
    <a
      className={className}
      href={href}
      rel={isExternalLink ? "noreferrer" : undefined}
      target={isExternalLink ? "_blank" : undefined}
    >
      <span className="project-action-icon" aria-hidden="true" />
      {action.label}
    </a>
  );
}
