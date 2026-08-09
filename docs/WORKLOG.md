# Registro de trabajo del portfolio

Este archivo sirve como punto de continuidad entre sesiones. Debe actualizarse al terminar
un bloque de trabajo importante, dejando la entrada más reciente arriba.

## Estado actual

- Última actualización: 9 de agosto de 2026.
- Rama de trabajo: `main`.
- Los cambios descritos en esta entrada todavía no están confirmados en Git.
- La build de producción termina correctamente.
- Persiste el aviso conocido de Vite por un chunk superior a 500 kB, relacionado con Phaser.

## 9 de agosto de 2026 — Incorporación de Nolvida

### Trabajo terminado

- Se añadió Nolvida como primer proyecto y proyecto seleccionado por defecto.
- Se creó un cartucho amarillo con el logo negro sobre fondo blanco, manteniendo las
  dimensiones de los cartuchos existentes.
- La versión de escritorio de Proyectos pasó a ser un carrusel circular de tres columnas:
  proyecto anterior, proyecto activo y proyecto siguiente.
- El carrusel móvil conserva su comportamiento anterior y ahora incluye cuatro proyectos.
- Se añadieron descripción, stack y estado de Nolvida a la fuente centralizada de proyectos.
- Se actualizaron los datos estructurados, `llms.txt`, sitemap y documentación general para
  reflejar el nuevo proyecto.
- La página de privacidad de Nolvida sigue disponible en `/nolvida/privacy`.

### Caso técnico de Nolvida

Se analizó el repositorio original de Nolvida en modo de solo lectura. El análisis cubrió:

- arquitectura local-first;
- Room como fuente de verdad;
- coordinación de mutaciones mediante `ReminderManager` y `Mutex`;
- captura de voz local con `SpeechRecognizer`;
- widget y servicio foreground;
- notificaciones persistentes y acción «Hecho»;
- reconciliación con WorkManager;
- privacidad, accesibilidad, pruebas y preparación de la release.

Se generaron dos documentos:

- `public/assets/cv/Resumen_tecnico_Nolvida_Pablo_Ramos.pdf`: resumen de una página enlazado
  desde el botón «Ver caso» del portfolio.
- `public/assets/cv/Caso_tecnico_Nolvida_Pablo_Ramos.pdf`: versión detallada de nueve páginas,
  conservada en el repositorio pero no enlazada desde la tarjeta.

Las fuentes editables están en `docs/nolvida-case/`:

- `summary.html` y `summary.css`: resumen actual de una página.
- `index.html` y `styles.css`: caso detallado.
- `assets/`: capturas y gráficos utilizados por ambos documentos.

### Decisiones que deben conservarse

- Nolvida utiliza el cartucho amarillo para completar la referencia a los cartuchos rojo,
  azul, verde y amarillo de Pokémon.
- El logo del cartucho es negro, con fondo blanco.
- En escritorio siempre se muestran tres cartuchos y el activo ocupa la posición central.
- La navegación es circular: después del último proyecto vuelve al primero.
- El botón principal de Nolvida se llama «Ver caso» y abre el resumen de una página.
- El PDF detallado no debe sustituir al resumen salvo que se decida explícitamente.

### Archivos principales modificados o añadidos

```text
src/data/projects.ts
src/components/projects/ProjectCartridges.tsx
src/styles/sections/projects/desktop.css
src/layouts/MainLayout.astro
public/assets/seccion3Proyects/cartuchoAmarilloNolvida-v2.png
public/assets/cv/Resumen_tecnico_Nolvida_Pablo_Ramos.pdf
public/assets/cv/Caso_tecnico_Nolvida_Pablo_Ramos.pdf
docs/nolvida-case/
public/llms.txt
public/sitemap.xml
README.md
```

### Validación realizada

```bash
cmd /c npm run build
```

Resultado: build correcta, dos rutas estáticas generadas y ambos PDF copiados a `dist`.
El resumen fue comprobado visualmente y validado como un PDF de exactamente una página.

### Siguiente paso recomendado

1. Abrir el portfolio en desktop y móvil para una última revisión manual del carrusel.
2. Comprobar el botón «Ver caso» y descargar el resumen desde la interfaz.
3. Revisar `git diff` y confirmar los cambios en Git cuando el resultado visual esté aprobado.
4. Cuando Nolvida se publique, cambiar el estado «Próximamente en Google Play» y añadir el
   enlace definitivo de Google Play.

## Cómo retomar el trabajo

Desde la raíz del proyecto:

```bash
git status --short
cmd /c npm run build
cmd /c npm run dev
```

La información de cada tarjeta debe seguir editándose en `src/data/projects.ts`; no debe
duplicarse dentro del componente React.
