// Accion disponible dentro del panel de detalle.
// - link: enlace normal.
// - confidential: muestra el aviso rojo de acceso denegado.
// - celebrate: lanza confeti pixel sin navegar fuera de la seccion.
export type ProjectAction = {
  href?: string;
  kind?: "link" | "confidential" | "celebrate";
  label: string;
  variant?: "primary";
};

// Estructura comun de cada proyecto. El componente React lee esta data para
// pintar cartuchos, texto, stack, estado y botones sin repetir HTML.
export type PortfolioProject = {
  actions: ProjectAction[];
  cartridge: {
    alt: string;
    src: string;
  };
  description: string[];
  id: string;
  label: string;
  stack: string[];
  status: string;
  title: string;
};

// Fuente unica de contenido para la seccion Proyectos.
// Al anadir o cambiar proyectos, deberia hacerse aqui antes de tocar el JSX.
export const projects: PortfolioProject[] = [
  {
    id: "restaurant-ai",
    label: "Asistente IA Restaurante",
    title: "Asistente conversacional personalizado para restaurantes",
    description: [
      "Chatbot basado en arquitectura RAG que se adapta a la carta y a la informacion real de cada restaurante.",
      "Permite consultar platos, ingredientes, alergenos, recomendaciones y dudas en lenguaje natural.",
    ],
    stack: [
      "PostgreSQL",
      "FastAPI",
      "Groq",
      "RAG",
      "Tools",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    status: "Demo disponible",
    cartridge: {
      src: "/assets/seccion3Proyects/cartuchoRojo.png",
      alt: "Cartucho del proyecto Asistente IA Restaurante",
    },
    actions: [
      { href: "#", label: "Ver demo", variant: "primary" },
      { href: "#", label: "GitHub" },
      { href: "#", label: "Ver caso" },
    ],
  },
  {
    id: "portfolio-8bit",
    label: "Portfolio interactivo 8-bit",
    title: "Portfolio interactivo 8-bit",
    description: [
      "Portfolio web con estetica retro inspirado en videojuegos clasicos, creado para presentar mi perfil, trayectoria y proyectos de forma interactiva.",
      "Incluye un mini juego embebido, cartuchos de proyectos y una seccion de contacto con estetica de terminal.",
    ],
    stack: ["Astro", "React", "TypeScript", "Phaser", "Tailwind CSS"],
    status: "Complete",
    cartridge: {
      src: "/assets/seccion3Proyects/CartuchoAzul.png",
      alt: "Cartucho del proyecto Portfolio interactivo 8-bit",
    },
    actions: [
      { kind: "celebrate", label: "Hiring", variant: "primary" },
      { href: "#", label: "GitHub" },
      { href: "#contacto", label: "Contacto" },
    ],
  },
  {
    id: "data-analyst",
    label: "Data Analyst",
    title: "Data Analyst",
    description: [
      "Experiencia en practicas desarrollando aplicaciones y dashboards en Qlik y Power BI.",
      "Trabajo desde la extraccion y limpieza de datos hasta su visualizacion final para apoyar la toma de decisiones.",
    ],
    stack: [
      "Qlik",
      "Power BI",
      "Python",
      "FastAPI",
      "SQL",
      "Excel",
      "ETL",
      "Data Visualization",
    ],
    status: "Confidencial",
    cartridge: {
      src: "/assets/seccion3Proyects/cartuchoVerde.png",
      alt: "Cartucho del proyecto Data Analyst",
    },
    actions: [{ kind: "confidential", label: "Mostrar", variant: "primary" }],
  },
];
