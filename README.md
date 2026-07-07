# Portfolio Pablo

Portfolio personal de Pablo: una web one-page con estética retro arcade 80s/90s, pensada para presentar perfil, trayectoria, proyectos y contacto de forma creativa, técnica y legible.

El proyecto combina secciones estáticas con interacción puntual: cartuchos de proyectos, una terminal de contacto y un mini juego narrativo embebido con Phaser.

## Stack

- Astro
- React
- TypeScript
- Phaser
- Tailwind CSS
- CSS personalizado
- Vercel

Requisito de Node:

```bash
node >= 22.12.0
```

## Secciones

La web está organizada como una landing one-page con cuatro bloques principales:

1. `Hero`: presentación principal de Pablo y avatar pixel art.
2. `Mi viaje`: mini juego narrativo sobre la trayectoria personal y profesional.
3. `Proyectos`: selector interactivo de proyectos con cartuchos retro.
4. `Contacto`: terminal simple con estado, email y enlaces.

La navegación permanece fija para facilitar el recorrido por la página.

## Arquitectura

La estructura busca separar responsabilidades:

- Astro compone layout y secciones estáticas.
- React se usa solo donde hay estado o interacción.
- Phaser vive aislado dentro de la sección `Mi viaje`.
- Los datos de proyectos están centralizados en `src/data/projects.ts`.
- Los estilos globales y por sección se separan en `src/styles`.

```text
src/
  pages/
    index.astro
  layouts/
    MainLayout.astro
  sections/
    Hero.astro
    Journey.astro
    Projects.astro
    Contact.astro
  components/
    Header.tsx
    game/
    projects/
  data/
    projects.ts
  game/
    assets/
    builders/
    data/
    entities/
    scenes/
    systems/
    ui/
  styles/
    base.css
    global.css
    header.css
    layout.css
    neon.css
    pixel.css
    theme.css
    components/
    sections/
```

Los assets que debe servir el navegador o Phaser viven en `public/assets`.

## Estilos

El diseño usa una base oscura con acentos cyan, magenta, púrpura y amarillo. El verde se reserva para terminales o estados.

Los estilos están divididos por responsabilidad:

- `theme.css`: tokens globales, fuentes y colores.
- `base.css`: reset mínimo, accesibilidad y utilidades globales.
- `layout.css`: estructura común de secciones.
- `header.css`: navegación fija.
- `sections/`: estilos propios de cada sección.
- `sections/projects/`: estilos de Proyectos divididos en parciales.

La sección de Proyectos está separada así:

```text
src/styles/sections/projects/
  index.css
  base.css
  desktop.css
  detail-panel.css
  actions.css
  effects.css
  responsive.css
```

## Juego

El mini juego se carga desde React mediante `GameWrapper` y crea una instancia de Phaser solo cuando el componente se monta en el navegador.

La lógica del juego está separada en:

- `scenes/`: pantallas del juego.
- `entities/`: jugador, pickups, bloque y portal.
- `systems/`: controles, respawn, diálogos y power-ups.
- `builders/`: construcción del nivel.
- `data/`: geometría del nivel y textos narrativos.
- `ui/`: HUD, caja de diálogo y botón de sonido.

## Comandos

Instalar dependencias:

```bash
npm install
```

Servidor de desarrollo:

```bash
npm run dev
```

Build de producción:

```bash
npm run build
```

Preview local del build:

```bash
npm run preview
```

Antes de considerar un cambio terminado, ejecutar:

```bash
npm run build
```

## Proyectos destacados

La sección Proyectos se alimenta desde `src/data/projects.ts`.

Proyectos actuales:

- Asistente conversacional personalizado para restaurantes.
- Portfolio interactivo 8-bit.
- Data Analyst.

Cada proyecto define título, descripción, stack, estado, cartucho visual y acciones.

## Criterios de mantenimiento

- Mantener Astro para secciones y layout.
- Usar React solo para componentes interactivos.
- Mantener Phaser dentro de la sección del juego.
- Evitar duplicar datos de proyectos en JSX.
- No rediseñar sin comprobar desktop y móvil.
- Mantener los comentarios útiles que expliquen decisiones no obvias.
- Priorizar cambios pequeños, verificables y con `npm run build`.

## Estado actual

Base estructural lista para trabajar SEO/GEO:

- Layout principal creado.
- Header fijo implementado.
- Cuatro secciones principales montadas.
- Proyectos interactivos funcionando.
- Contacto estilo terminal funcionando.
- Mini juego Phaser integrado.
- CSS de Proyectos refactorizado en archivos temáticos.

Pendientes recomendados:

- Revisar semántica y accesibilidad ligera.
- Añadir metadatos SEO/Open Graph.
- Revisar contenido para GEO y lectura por LLMs.
- Optimizar assets grandes si se confirma que no se usan.
