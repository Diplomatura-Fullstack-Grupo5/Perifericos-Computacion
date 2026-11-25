---
name: revisar-pr
description: Revisión previa de un Pull Request de PuntoTech antes de mostrárselo al equipo. Contrasta los cambios contra las buenas prácticas de la Diplomatura (lo que la cátedra enseña y lo que dice NO usar), las reglas de AGENTS.md y la arquitectura del repo, corre lint y build, y entrega un informe con hallazgos por gravedad. Usar cuando se pida "revisar el PR", "review antes de abrir el PR", "revisá mi rama", "/revisar-pr" o un chequeo de calidad de cambios del frontend.
---

# Revisar PR (primer filtro antes del equipo)

Objetivo: encontrar **antes de abrir o pedir revisión del PR** lo que el equipo o la cátedra marcarían.
No reemplaza la revisión de los compañeros: es el primer filtrado.

## Orden de prioridad de las reglas

1. **Lo que enseña la cátedra** (teoría de la Diplomatura) y lo que dice que **no** se use.
2. **Las convenciones del repo**: `AGENTS.md` y lo que ya está hecho. Si el repo eligió algo distinto
   de la clase pero lo aplica de forma consistente (por ejemplo componentes con exportación nombrada,
   Bootstrap por npm en lugar de CDN), **se sigue al repo y no se marca como error**.
3. Conocimiento externo, solo si no contradice lo anterior. La skill `react-vite-best-practices`
   es de terceros: si sugiere algo que choca con el curso o con `AGENTS.md` (por ejemplo `useMemo`
   manual), gana el curso.

Las reglas concretas, con su fuente, están en [checklist.md](checklist.md). Leelo completo antes de revisar.

## Pasos

### 1. Delimitar qué se revisa
- Por defecto: la rama actual contra `origin/main` (incluye cambios sin commitear).
  ```bash
  git fetch origin main
  git diff --stat origin/main...HEAD
  git status --short
  ```
- Si se pasa un número de PR: `gh pr diff <n>` y `gh pr view <n>` (título, descripción, rama).
- Si se pide otra base o una carpeta, usar esa.
- Anotar qué features toca el cambio (`frontend/src/features/<x>`), si toca `shared/`, `api/`, `app/`,
  `database/` o `vite.config.js`. Eso define qué secciones del checklist pesan más.

### 2. Chequeos automáticos
Desde la raíz del repo:
```bash
bash .claude/skills/revisar-pr/scripts/chequeos.sh            # archivos cambiados vs origin/main
bash .claude/skills/revisar-pr/scripts/chequeos.sh --todo     # todo frontend/src (auditoría general)
```
El script corre `npm run lint` y `npm run build` en `frontend/` y busca patrones conocidos (fetch fuera de
`api/cliente.js`, imports a internos de otra feature, `key` con índice, Bootstrap 4, `!important`,
`useMemo` manual, etc.). **Sus avisos son candidatos, no veredictos**: confirmá cada uno leyendo el código.
Si `node_modules` no existe, correr antes `npm ci` en `frontend/`.

### 3. Lectura del diff
- Leer **cada archivo cambiado completo** (no solo el diff): muchas reglas dependen del contexto
  (dónde vive el estado, qué exporta el `index.js`, si el `useEffect` tiene limpieza).
- Recorrer las secciones del [checklist](checklist.md) que apliquen. Para cada hallazgo, anotar archivo,
  línea, regla, fuente y una corrección concreta.
- Comparar con el código existente del repo que resuelve algo parecido (por ejemplo, una página nueva
  contra `features/producto/pages/ProductoPage.jsx`). Si el cambio se aparta del patrón ya usado sin motivo,
  es un hallazgo.
- Si hay pantallas nuevas y se puede levantar `npm run dev`, mirarlas en el navegador: estados de carga,
  error y vacío, celular (≤ 576 px), teclado (Tab/Enter/Esc) y modo oscuro si aplica.

### 4. Descripción del PR
Si hay PR (o se va a abrir), verificar que la descripción diga qué cambia, cómo probarlo y,
como pide la cátedra, **qué propuso la IA, qué se corrigió y por qué** cuando se usó IA.

### 5. Informe
Responder **en español** con este formato:

```markdown
## Revisión previa · <rama o PR>

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
  (falta estado de carga/error, `useEffect` sin limpieza, estado que debería derivarse, accesibilidad,
  JSDoc faltante, CSS sin prefijo, `!important`).
- **Sugerencia:** mejoras de legibilidad, nombres, duplicación menor, UX.

Reglas del informe:
- Cada hallazgo con `archivo:línea` y su fuente (`Curso · React clase 1`, `AGENTS.md`, `Patrón del repo`…).
- No inventar reglas: si algo no está en el checklist ni en el material, va como sugerencia y se dice que es
  criterio propio.
- No marcar lo que ya estaba en `main` y el PR no tocó (se puede mencionar al final como "deuda existente").
- **No modificar código ni publicar comentarios en GitHub** salvo que se pida. Si se pide corregir, hacerlo
  hallazgo por hallazgo y volver a correr los chequeos.
