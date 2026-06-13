import { useEffect, useState } from "react";

// Lista unica de enlaces del menu. Si anadimos una seccion, la registramos aqui.
const navItems = [
  {
    href: "#viaje",
    icon: "01",
    iconClass: "nav-icon--travel",
    id: "viaje",
    label: "Mi viaje",
  },
  {
    href: "#proyectos",
    icon: "02",
    iconClass: "nav-icon--projects",
    id: "proyectos",
    label: "Proyectos",
  },
  {
    href: "#contacto",
    icon: "03",
    iconClass: "nav-icon--contact",
    id: "contacto",
    label: "Contacto",
  },
];

export default function Header() {
  // activeSection cambia al hacer scroll y sirve para pintar el enlace activo.
  const [activeSection, setActiveSection] = useState("hero");

  // isOpen controla el menu desplegable en pantallas pequenas.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Buscamos en el DOM las secciones reales para observarlas al hacer scroll.
    const sections = ["hero", ...navItems.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    // IntersectionObserver evita escuchar el scroll manualmente todo el tiempo.
    // Cuando una seccion entra en la zona central de la pantalla, pasa a activa.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navegacion principal">
        {/* Marca principal: tambien funciona como enlace de vuelta al Hero. */}
        <a
          className={`brand-mark ${activeSection === "hero" ? "is-active" : ""}`}
          href="#hero"
          onClick={() => setIsOpen(false)}
        >
          <span className="brand-icon" aria-hidden="true">
            <span>&lt;/</span>
            <span className="brand-icon__accent">&gt;</span>
          </span>
          <span>PABLO.DEV</span>
        </a>

        {/* Boton visible solo en movil para abrir/cerrar el menu. */}
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="sr-only">Menu</span>
        </button>

        {/* En desktop se ve como barra horizontal; en movil como desplegable. */}
        <div
          className={`nav-links ${isOpen ? "is-open" : ""}`}
          id="primary-menu"
        >
          {navItems.map((item) => (
            <a
              className={activeSection === item.id ? "is-active" : ""}
              href={item.href}
              key={item.id}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon" aria-hidden="true">
                <span className={item.iconClass ?? ""}>{item.icon}</span>
              </span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
