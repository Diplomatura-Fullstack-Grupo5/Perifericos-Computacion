---
name: revisar-pr
description: Code review de PuntoTech antes de mostrarle un PR al equipo. Contrasta los cambios contra las buenas prácticas de la Diplomatura (lo que la cátedra enseña y lo que dice NO usar), las reglas de AGENTS.md y la arquitectura del repo, verifica lint y build, y entrega un informe con hallazgos por gravedad. Usar cuando se pida "code review", "hacé una review", "revisá el PR", "revisá mi rama", "review antes de abrir el PR" o un chequeo de calidad de cambios del frontend.
---

# Code review (primer filtro antes del equipo)

Objetivo: encontrar **antes de abrir o pedir revisión del PR** lo que el equipo o la cátedra marcarían.
No reemplaza la revisión de los compañeros: es el primer filtrado.

La fuente de criterio es [checklist.md](checklist.md). **Leelo completo antes de revisar.**

## Orden de prioridad de las reglas

1. **Lo que enseña la cátedra** (teoría de la Diplomatura) y lo que dice que **no** se use.
2. **Las convenciones del repo**: `AGENTS.md` y lo que ya está hecho. Si el repo eligió algo distinto
   de la clase pero lo aplica de forma consistente (por ejemplo componentes con exportación nombrada,
   Bootstrap por npm en lugar de CDN), **se sigue al repo y no se marca como error**.
3. Conocimiento externo, solo si no contradice lo anterior. La skill `react-vite-best-practices`
   es de terceros: si sugiere algo que choca con el curso o con `AGENTS.md` (por ejemplo `useMemo`
   manual), gana el curso.

## Pasos

### 1. Delimitar qué se revisa
- Por defecto: la rama actual contra `origin/main`, incluidos los cambios sin commitear y los archivos nuevos
  (`git fetch origin main`, `git diff --stat origin/main...HEAD`, `git status --short`).
- Si se pasa un número de PR: `gh pr diff <n>` y `gh pr view <n>` (título, descripción, rama).
- Si se pide revisar todo el proyecto o una carpeta, usar ese alcance.
- Anotar qué toca el cambio: qué features (`frontend/src/features/<x>`), y si toca `shared/`, `api/`, `app/`,
  `database/` o `vite.config.js`. Eso define qué secciones del checklist pesan más.
- Si aparecen en el cambio `dist/`, `node_modules/` o un `.env`, es un bloqueante.

### 2. Lint y build
En `frontend/` correr `npm run lint` y `npm run build` (si falta `node_modules`, antes `npm ci`).
Cualquier error es bloqueante; copiar en el informe las líneas relevantes.

### 3. Búsquedas rápidas sobre los archivos cambiados
Buscar estos patrones en los archivos del alcance (con la herramienta de búsqueda del agente). Cada coincidencia
es un **candidato**: confirmarlo leyendo el código antes de reportarlo, e ignorar las que estén en comentarios.

| Buscar | Dónde | Qué indica | Gravedad |
|---|---|---|---|
| `fetch(` | `.js/.jsx` fuera de `api/cliente.js` | Acceso a datos fuera del cliente único | Bloqueante |
| `from "../../<otra-feature>/components\|pages\|services\|hooks\|utils/…"` | `features/` | Import a internos de otra feature (usar su `index.js`) | Bloqueante |
| `features/` en un import | `shared/` | `shared` depende de una feature | Bloqueante |
| `innerHTML`, `dangerouslySetInnerHTML`, `appendChild`, `document.createElement`, `querySelector`, `getElementById` | `.jsx` (salvo `main.jsx`) | DOM manipulado a mano | Bloqueante (confirmar; ver excepciones en el checklist) |
| `key={i}`, `key={index}`, `key={idx}` | `.jsx` | Índice como `key` | Bloqueante |
| `onAlgo={funcion()}` | `.jsx` | Manejador ejecutado al renderizar | Bloqueante |
| `var ` | `.js/.jsx` | Declaración con `var` | Bloqueante |
| `ml-`, `mr-`, `pl-`, `pr-`, `data-toggle`, `data-target`, `form-group`, `custom-select`, `float-left`, `text-left`, `jquery` | `.jsx` | Bootstrap 4 | Bloqueante |
| `password`, `secret`, `token`, `apiKey` con un valor literal; `VITE_…SECRET/TOKEN/KEY` | todo el cambio | Posible secreto | Bloqueante |
| `/database` como texto | `.js/.jsx` fuera de `api/endpoints.js` | Ruta escrita a mano (usar `ENDPOINTS`) | Importante |
| `localStorage.` | fuera de `shared/hooks/useLocalStorage.js` | Usar el hook compartido | Importante |
| `useMemo`, `useCallback`, `memo(` | `.js/.jsx` | Memo manual con React Compiler activo | Importante |
| `export default` | fuera de `app/App.jsx` | El repo usa exportaciones nombradas | Importante |
| ` == `, ` != ` | `.js/.jsx` | Usar `===` / `!==` | Importante |
| `bg-white`, `text-dark` | `.jsx` | Usar `bg-body` / `text-body` | Importante |
| `!important` | `.css` | Evitar en CSS propio | Importante |
| `<img` sin `alt` | `.jsx` | Imagen sin texto alternativo | Importante |
| `useEffect` que pide datos sin `ignoreResponse` (o equivalente) en la limpieza | `.jsx` | No ignora respuestas viejas | Importante |
| `export function` sin `/** … */` justo antes | `.js/.jsx` | Falta JSDoc | Importante |
| `style={{` | `.jsx` | Estilo inline | Sugerencia |
| `console.log` | `.js/.jsx` | Log olvidado (`console.error` en un `catch` está bien) | Sugerencia |
| Colores fijos (`#…`, `rgb(`) | `.css` | Preferir variables `--bs-*` | Sugerencia |

Si el cambio toca `database/*.json`, verificar que los JSON sean válidos y que respeten el modelo de specs.

### 4. Lectura completa de los archivos cambiados
- Leer **cada archivo cambiado completo**, no solo el diff: muchas reglas dependen del contexto
  (dónde vive el estado, qué exporta el `index.js`, si el `useEffect` tiene limpieza).
- Recorrer las secciones del [checklist](checklist.md) que apliquen. Para cada hallazgo, anotar archivo,
  línea, regla, fuente y una corrección concreta.
- Comparar con el código del repo que ya resuelve algo parecido (por ejemplo, una página nueva contra
  `features/producto/pages/ProductoPage.jsx`, un contexto nuevo contra el del comparador). Si el cambio se aparta
  del patrón ya usado sin motivo, es un hallazgo.
- Recordatorios según lo que toque el cambio:
  - **Router:** ¿la ruta cuelga del layout correcto? ¿se sacó de `PAGINAS_EN_CONSTRUCCION`? ¿las de admin están protegidas?
  - **`productos.json` / `categorias.json`:** ¿specs clave → valor, mismas claves por categoría, marca nueva en `marcas.json`?
  - **`vite.config.js`:** ¿es solo para desarrollo, está documentado y marcado para borrar cuando exista el backend?
- Si hay pantallas nuevas y se puede levantar `npm run dev`, mirarlas en el navegador: estados de carga,
  error y vacío, celular (≤ 576 px), teclado (Tab, Enter, Esc).

### 5. Descripción del PR
Si hay PR (o se va a abrir), verificar que la descripción diga qué cambia, cómo probarlo y,
como pide la cátedra, **qué propuso la IA, qué se corrigió y por qué** cuando se usó IA.

### 6. Informe
Responder **en español** con este formato:

```markdown
## Code review · <rama o PR>

**Veredicto:** Listo para el equipo | Listo con ajustes menores | Corregir antes de abrir el PR
**Alcance:** <n> archivos · features: <lista> · lint: ✔/✘ · build: ✔/✘

### Bloqueantes
1. `ruta/archivo.jsx:42` · <qué pasa>. **Regla:** <regla> (<fuente>). **Corrección:** <qué hacer>.

### Importantes
…

### Sugerencias
…

### Lo que está bien
- <2 a 4 puntos concretos: qué patrones del repo o del curso se respetaron>
```

Gravedad:
- **Bloqueante:** lint o build fallan; rompe una regla de arquitectura de `AGENTS.md` (fetch fuera de
  `api/cliente.js`, import a internos de otra feature, `shared/` importando `features/`); algo que la cátedra
  dice explícitamente que no se use (DOM a mano en React, `key` con índice, Hooks condicionales,
  `innerHTML` con datos, Bootstrap 4, `var`); secretos en el código; rompe el modelo de specs estructuradas.
- **Importante:** se aparta de una buena práctica del curso o de un patrón ya establecido en el repo
  (falta estado de carga o error, `useEffect` sin limpieza, estado que debería derivarse, accesibilidad,
  JSDoc faltante, CSS sin prefijo, `!important`).
- **Sugerencia:** mejoras de legibilidad, nombres, duplicación menor, UX.

Reglas del informe:
- Cada hallazgo con `archivo:línea` y su fuente (`Curso · React clase 1`, `AGENTS.md`, `Patrón del repo`…).
- No inventar reglas: si algo no está en el checklist ni en el material, va como sugerencia y se aclara que es
  criterio propio.
- No marcar lo que ya estaba en `main` y el cambio no tocó (se puede mencionar al final como "deuda existente").
- **No modificar código ni publicar comentarios en GitHub** salvo que se pida. Si se pide corregir, hacerlo
  hallazgo por hallazgo y volver a revisar.
