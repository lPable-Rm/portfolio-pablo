# AGENTS.md

## Project
Personal portfolio for Pablo: a one-page creative developer portfolio with a dark retro 80s/90s arcade aesthetic.

Tone: creative, technical, polished, readable, and performant. Avoid childish or overloaded visuals.

## Stack
Use the existing stack. Do not replace it unless explicitly requested.

- Astro
- React
- TypeScript
- Phaser
- Tailwind CSS
- Custom CSS
- Vercel

## Sections
The site has 4 main sections:

1. Hero
2. Mi viaje
3. Proyectos
4. Contacto

The header must stay fixed/sticky across the page.

## Visual direction
Use a dark neon retro style:

- deep navy / near-black background
- cyan, magenta, purple, yellow accents
- green only for terminal/status accents
- pixel-style typography only for titles, labels, buttons, and UI details
- readable modern fonts for body text
- monospace for terminal UI

Avoid:
- unreadable pixel fonts in paragraphs
- too many glowing elements
- excessive animations
- cluttered layouts

## Header
Fixed navigation:

`PABLO.DEV | Mi viaje | Proyectos | Contacto`

Behavior:
- dark translucent background
- subtle blur
- subtle neon border
- active section highlight
- mobile can use a simplified menu button

Do not add large CTA buttons inside the Hero body.

## Hero
Purpose: introduce Pablo clearly.

Copy:

Hola, soy Pablo.  
Desarrollador creativo con mentalidad fullstack.

No me gusta encerrarme en una sola etiqueta. Construyo proyectos completos combinando frontend, backend, datos e inteligencia artificial.

Cuando una idea me motiva, aprendo lo necesario para hacerla realidad.

Hero should include a retro/pixel visual element, such as a “Pablo Quest / Press Start” panel or avatar.

## Mi viaje
Purpose: tell Pablo’s journey through a short embedded retro game.

This section contains:
- retro game frame
- Phaser mini game
- compact timeline below
- CV download link

The game is a short narrative platformer, not a full videogame.

Game skeleton:
1. Pablito pequeño
   - intro about curiosity
2. Pesa / deporte
   - collect weight
   - transform into Pablo with weight
   - push block to cover a gap
   - meaning: sport, teamwork, constancy, sacrifice
3. Flotador / socorrista
   - collect float ring
   - cross a small pool
   - meaning: responsibility, attention, calmness
4. Caja + libreta / trabajo + estudio
   - collect box and notebook/book
   - climb platforms/stairs
   - meaning: working in supply/warehouse while studying DAM
5. Portátil / Pablo Dev
   - collect laptop
   - transform into Pablo Dev
   - cross the goal

Final screen:

CONTRATULATIONS!  
Has desbloqueado a Pablo Dev.  
Gracias por jugar mi viaje.  
HIRING MODE: ON  
NEXT LEVEL: PROYECTOS

Narrative UI:
- use retro dialogue boxes
- keep text short
- each phase can have intro, power-up, and meaning message

Game visual direction:
- continuous level, not separate screens
- coherent background zones: gym, pool, warehouse/study, technology
- transitions should feel gradual
- parallax is allowed later, but performance comes first
- start with placeholder shapes before final pixel art

## Timeline / CV
Below the game, include a compact fallback timeline:

Curiosidad → Deporte → Socorrista → Trabajo + estudio → Pablo Dev

Add a CV download link. Do not make this area too infographic-heavy.

## Proyectos
Purpose: show 3 main projects with Game Boy-inspired cartridges.

Rules:
- cartridges are inspired by retro handheld games
- do not copy Nintendo, Pokémon, or copyrighted assets
- selecting a cartridge updates a clear project detail panel
- do not create a second game in this section

Project 1 is selected by default.

### Project 1
Title:
Asistente conversacional personalizado para restaurantes

Description:
Chatbot basado en arquitectura RAG que se adapta a la carta y a la información real de cada restaurante.

Permite consultar platos, ingredientes, alérgenos, recomendaciones y dudas en lenguaje natural, simplificando menús extensos y reduciendo barreras de idioma.

Stack:
PostgreSQL · FastAPI · Groq · RAG · Tools / Function Calling · HTML · CSS · JavaScript

Status:
Demo disponible

Actions:
Ver demo · GitHub · Ver caso

### Project 2
Title:
Portfolio interactivo 8-bit

Description:
Portfolio web con estética retro inspirado en videojuegos clásicos, creado para presentar mi perfil, trayectoria y proyectos de forma interactiva.

Incluye un mini juego embebido, cartuchos de proyectos y una sección de contacto con estética de terminal.

Stack:
Astro · React · TypeScript · Phaser · Tailwind CSS

Status:
Complete

Actions:
Hiring · GitHub · Contacto

### Project 3
Title:
Data Analyst

Description:
Experiencia en prácticas desarrollando aplicaciones y dashboards en Qlik y Power BI, trabajando desde la extracción y limpieza de datos hasta su visualización final.

Creación de extractores, transformación de datos y construcción de paneles para facilitar el análisis de información y apoyar la toma de decisiones.

Stack:
Qlik · Power BI · Python · FastAPI · SQL · Excel · ETL · Data Visualization

Status:
Confidencial

Action:
Mostrar

When clicking “Mostrar”, show a red retro alert:

> show_project  
ACCESS DENIED  
Este proyecto contiene información confidencial.

## Contacto
Purpose: make contacting Pablo easy.

Use a large, simple terminal-style panel.

Terminal content:

> whoami  
Pablo — Desarrollador creativo con mentalidad fullstack

> status  
Disponible para nuevas oportunidades

> contact  
pablo@email.com

> links  
GitHub · LinkedIn · Descargar CV

> _

Optional badge:
HIRING MODE: ON

Keep this section simple. Do not turn it into another game.

## Code style
Use:
- Astro for static sections and layout
- React only for interactive components
- Phaser only inside the game section
- TypeScript for props, data, and game state
- Tailwind for layout, spacing, and responsive design
- Custom CSS for neon, pixel, arcade, and terminal effects

Prefer:
- small components
- semantic HTML
- accessible navigation
- data-driven project content
- reusable visual utility classes

Avoid:
- unnecessary dependencies
- large monolithic components
- repeated hardcoded project data
- complex animation libraries unless requested

## Performance
Prioritize performance.

- lazy-load Phaser if possible
- keep JavaScript minimal outside interactive components
- optimize images, sprites, and backgrounds
- avoid huge uncompressed assets
- respect reduced-motion preferences
- ensure desktop and mobile usability

## Accessibility
- maintain readable contrast
- body text must remain legible
- navigation must be keyboard accessible
- do not rely only on color to show state
- keep non-game timeline content available
- contact links must be real links/buttons

## Commands
Common commands:

```bash
npm run dev
npm run build
npm run preview
```

Before considering work complete:
- run `npm run build`
- fix TypeScript/build errors

## Folder guidance
Expected structure:

```text
src/
  pages/
  layouts/
  sections/
  components/
  game/
  data/
  styles/

public/
  assets/
    images/
    sprites/
    backgrounds/
    audio/
    cv/
```

Use `public/assets` for files that Phaser or the browser must load directly.

## Current priority
The project is in early implementation.

Priority order:
1. base layout
2. fixed header
3. four section structure
4. visual theme
5. project cartridge interaction
6. contact terminal
7. game frame placeholder
8. Phaser prototype
9. final pixel art and assets
