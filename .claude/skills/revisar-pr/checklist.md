# Checklist de revisión · PuntoTech

Cada regla indica su **fuente**:
- **Curso**: teoría de la Diplomatura (clase de Arquitectura, React + Vite clase 1, HTML, CSS,
  Bootstrap 5.3, JavaScript clases 1 a 3, UX y usabilidad, práctico "Humana vs IA").
- **AGENTS.md**: convenciones del proyecto.
- **Repo**: patrón ya usado en `main` (seguirlo salvo motivo).

Gravedad sugerida entre corchetes: **[B]** bloqueante, **[I]** importante, **[S]** sugerencia.

---

## 1. Arquitectura del frontend

- **[B]** Solo `src/api/cliente.js` hace `fetch`. Componentes y páginas piden datos al service de su feature,
  y el service usa `pedir()` (o la función de escritura acordada) con rutas de `ENDPOINTS`. *(AGENTS.md, Curso · Arquitectura)*
- **[B]** Una feature no importa archivos internos de otra: solo lo que exporta su `index.js`
  (`from "../../comparador"` ✔, `from "../../comparador/hooks/useComparador"` ✘). *(AGENTS.md, Curso · React: "index.js es el contrato")*
- **[B]** `shared/` nunca importa de `features/`. *(AGENTS.md)*
- **[I]** Lo que usa una sola feature vive en esa feature; pasa a `shared/` recién cuando otra lo necesita.
  Prueba de pertenencia: si menciona productos, pedidos o specs, no es de `shared/`. *(AGENTS.md, Curso · React)*
- **[I]** Estructura de la feature: `components/`, `pages/`, `services/`, `hooks/`, `utils/` solo si hacen falta,
  e `index.js` que expone las páginas y lo que otra feature necesite (nada más). *(Curso · React, AGENTS.md)*
- **[I]** No crear módulos por tipo técnico ni por tipo de usuario (`botones`, `formularios`, `utilidades`, `api`).
  Público y privado se resuelven con layouts (`LayoutPublico` / `LayoutPrivado`) y control de acceso, no con carpetas.
  *(Curso · React)* Para la zona admin, respetar lo que el equipo haya acordado en `AGENTS.md`.
- **[I]** Rutas nuevas en `app/router.jsx`, como hijas del layout que corresponde. Si la página estaba en
  `PAGINAS_EN_CONSTRUCCION`, sacarla de esa lista. *(Repo)*
- **[I]** Rutas del admin protegidas (loader tipo `protegerRuta`) y, en el texto del PR, aclarar que la protección
  real va en el backend con `auth` + `requiereRol`: ocultar en el front no alcanza. *(AGENTS.md, Curso · Arquitectura)*
- **[I]** La lógica que mañana irá al backend (filtrar, ordenar, calcular totales, métricas) vive en el **service**,
  nunca en el componente; la función documenta qué endpoint simula (`Simula GET /api/...`). *(Repo, Curso · Arquitectura: "en caso de duda la regla de negocio va en el back")*
- **[I]** Endpoints simulados alineados con los de la propuesta del grupo (`/api/productos`, `/api/pedidos/:id/estado`,
  `/api/admin/dashboard`…) cuando existan. *(Propuesta de arquitectura)*

## 2. Datos (`database/*.json`)

- **[B]** No romper el modelo de specs estructuradas: `specs` solo **clave → valor**, números como números, la unidad
  en el nombre de la clave, `null` = no aplica, todas las claves iguales dentro de una categoría. *(AGENTS.md)*
- **[B]** Una spec nueva se define en `categorias.json` (`label`, `unit`, `featured`, `rule`, `filter`); el orden de
  las claves es el orden en pantalla. Formularios y filtros de specs se generan desde esas definiciones, no a mano. *(AGENTS.md)*
- **[I]** Marca nueva en `productos.json` → también en `marcas.json`. *(AGENTS.md)*
- **[I]** Claves de datos en inglés (`name`, `price`, `status`…). JSON válido: comillas dobles, sin comentarios ni coma final. *(AGENTS.md, Curso · JS 3)*
- **[I]** Imágenes de producto en `frontend/public/images/products/`, `.webp`, fondo blanco o transparente. *(AGENTS.md)*
- **[I]** Un recurso nuevo (pedidos, usuarios…) se agrega a `ENDPOINTS` en `api/endpoints.js`; nada de rutas `/database/...` escritas a mano. *(Repo)*

## 3. React

- **[B]** No tocar el DOM a mano: nada de `innerHTML`, `appendChild`, `document.createElement`, `querySelector` para
  cambiar la página. (Excepciones ya usadas en el repo: `createPortal(…, document.body)`, `scrollIntoView` en Legales.) *(Curso · React)*
- **[B]** `key` con un id estable del dato, **nunca el índice** del `map`. *(Curso · React)*
- **[B]** Hooks solo en el nivel superior de componentes o de otros Hooks; nunca dentro de `if`, `for` o funciones anidadas. *(Curso · React)*
- **[B]** Manejadores pasados como referencia: `onClick={guardar}` o `onClick={() => guardar(id)}`, nunca `onClick={guardar()}`. *(Curso · React)*
- **[I]** Componentes en PascalCase, un componente por archivo, `.jsx` si tiene marcado y `.js` si es lógica pura. *(Curso · React)*
- **[I]** Exportación **nombrada** para componentes (`export function TarjetaProducto`), como en todo el repo; `export default` solo en `App.jsx`. *(Repo; el curso usa default, pero se sigue la convención del repo)*
- **[I]** Props desestructuradas en el parámetro; valores por defecto solo en las props opcionales; props de funciones con prefijo `on` (`onGuardar`). *(Curso · React)*
- **[I]** Prop común para datos, `children` para marcado (layouts, modales, paneles). *(Curso · React)*
- **[I]** JSX: `className`, `htmlFor`, etiquetas cerradas, condicionales con ternario / `&&` / `if` antes del `return`. *(Curso · React)*
- **[I]** Sin `useMemo`, `useCallback` ni `React.memo` manuales (React Compiler activo), salvo motivo medido y explicado. *(AGENTS.md)*
- **[S]** Nada de `style={{…}}` salvo valores dinámicos imposibles de resolver con clases. *(Curso · CSS / Bootstrap: "inline casi nunca")*

## 4. Estado, efectos y carga de datos

- **[I]** El estado vive en el componente más bajo que lo necesita. Estado global (sesión, carrito, comparador) en un
  contexto + hook **de su feature** (modelo: `ComparadorProvider` + `comparadorContext.js` + `useComparador`). *(AGENTS.md, Repo)*
- **[I]** Lo que cambia por una acción del usuario se actualiza en el manejador del evento, no en un `useEffect`. *(AGENTS.md)*
- **[I]** Lo que se puede calcular a partir de props o estado se calcula al renderizar (ej. `const cargando = resultado.id !== id`), no se guarda en otro `useState`. *(Repo)*
- **[I]** Los `useEffect` que piden datos ignoran respuestas viejas con la limpieza (`let ignoreResponse = false … return () => { ignoreResponse = true }`). *(AGENTS.md, Repo)*
- **[I]** Toda pantalla que carga datos muestra **tres estados**: cargando (`<Spinner />`), error (`alert alert-danger` con `role="alert"` y mensaje para el usuario) y vacío (`<MensajeVacio>`). *(Curso · JS 3, Repo)*
- **[I]** Filtros, búsquedas y paginación que conviene compartir o recargar van en la URL (`useSearchParams`), como en el catálogo. *(Repo; Curso · UX: no romper Atrás)*
- **[I]** `localStorage` a través de `shared/hooks/useLocalStorage` (valida lo leído), no directo. *(Repo; Curso · JS 3: `JSON.stringify/parse`)*
- **[I]** Bootstrap JS (`data-bs-toggle`) solo para abrir/cerrar (dropdown, collapse); lo que se muestra lo decide React. No controlar lo mismo con los dos. Modales con `shared/components/molecules/Modal` / `ModalConfirmacion`. *(AGENTS.md, Repo)*

## 5. JavaScript

- **[B]** Nada de `var`; `const` por defecto y `let` si cambia. *(Curso · JS 1)*
- **[I]** Siempre `===` / `!==`; conversiones explícitas (`Number(id)`: lo que viene de la URL o de un input es texto). *(Curso · JS 1)*
- **[I]** No mutar arrays ni objetos de estado o de datos: spread, `map`, `filter`. `sort` muta: copiar antes (`[...lista].sort`). *(Curso · JS 1)*
- **[I]** `async/await` (o `then/catch`) con manejo de error; `response.ok` revisado (ya lo hace `pedir()`). *(Curso · JS 3)*
- **[I]** Funciones chicas, una sola responsabilidad, nombres descriptivos en camelCase y en español (`calcularTicketPromedio`). *(Curso · JS 1, AGENTS.md)*
- **[S]** Template literals en lugar de concatenar; `?.` y `??` para datos que pueden faltar; precios con `formatearPrecio` y specs con `formatearValorSpec` de `shared/utils`. *(Curso · JS, Repo)*
- **[S]** Sin `console.log` olvidados (los `console.error` en los `catch` están bien). *(Criterio del repo)*

## 6. HTML semántico y accesibilidad

- **[I]** Un solo `h1` por página, jerarquía sin saltos; el tamaño se ajusta con clases (`fs-5`), no cambiando la etiqueta. *(Curso · HTML, Bootstrap)*
- **[I]** Etiquetas semánticas (`section`, `article`, `aside`, `nav`, `header`), tablas solo para datos tabulares (con `thead`/`th`). *(Curso · HTML)*
- **[I]** `alt` descriptivo en toda imagen; íconos decorativos con `aria-hidden="true"` y texto visible o `aria-label` en botones de ícono. *(Curso · HTML, UX)*
- **[I]** Cada campo con `<label htmlFor>`; botones con `type` explícito. *(Curso · HTML)*
- **[S]** Navegable con teclado (Tab, Enter, Esc) y contraste adecuado; Lighthouse de accesibilidad sin errores. *(Curso · Bootstrap, UX)*

## 7. CSS

- **[I]** CSS del componente al lado, con el mismo nombre (`Tabla.jsx` + `Tabla.css`) y **clases con prefijo propio** (el CSS importado es global). *(AGENTS.md)*
- **[I]** Sin `!important` en código propio. (Hay usos heredados en `main` para ganarle a utilidades de Bootstrap: no copiarlos sin motivo; preferir variables `--bs-*`.) *(Curso · CSS)*
- **[I]** Nada de `float` para layout, números mágicos ni márgenes negativos "a ojo"; Flexbox / grilla de Bootstrap. *(Curso · CSS)*
- **[I]** Personalizar Bootstrap con sus variables (`--bs-btn-hover-bg`, `var(--bs-success)`) antes que con colores fijos. *(Curso · CSS, Repo)*
- **[S]** Mobile-first, unidades relativas, sin scroll horizontal en celular. *(Curso · CSS)*

## 8. Bootstrap 5.3

- **[B]** Nada de Bootstrap 4: `ml-*`/`mr-*`/`pl-*`/`pr-*` (usar `ms`/`me`/`ps`/`pe`), `data-toggle`/`data-target` (usar `data-bs-*`), `form-group` (usar `mb-3`), `custom-select`/`custom-checkbox`, `float-left`/`text-left`/`text-right`, jQuery. *(Curso · Bootstrap)*
- **[I]** Utilidades antes que CSS propio; CSS propio solo para lo que Bootstrap no resuelve. *(Curso · Bootstrap, práctico Humana vs IA)*
- **[I]** Grilla: contenedor > `.row` > `.col`, gutters con `g-*` (no márgenes en cada columna). *(Curso · Bootstrap)*
- **[I]** `btn` siempre con variante; `bg-body`/`text-body` en lugar de `bg-white`/`text-dark`. *(Curso · Bootstrap)*
- **[I]** Bootstrap se carga una sola vez (npm, en `main.jsx`): no agregar el CDN. *(Curso · React: "una sola forma", Repo)*
- **[S]** Iconos con Bootstrap Icons (`bi bi-<nombre>`), no otra librería. *(AGENTS.md)*

## 9. UX, formularios y diseño

- **[I]** Paleta: azul = acción, verde = positivo / "mejor valor", rojo solo para errores y acciones destructivas, fondo claro, tipografía del sistema. *(AGENTS.md, Propuesta)*
- **[I]** Formularios: pedir solo lo necesario, una columna, obligatorios marcados, validación nativa + `was-validated` (rojo recién después de intentar enviar), errores **junto al campo** y sin borrar lo escrito, una acción primaria con nombre específico ("Guardar producto", no "Aceptar"), sin botón Reset, evitar doble envío. *(Curso · Bootstrap, UX)*
- **[I]** Acciones destructivas (borrar, vaciar) con confirmación que diga qué se va a hacer (`ModalConfirmacion`), no un "¿Está seguro?" vacío. *(Curso · UX, Repo)*
- **[I]** Feedback: estado de carga, éxito y error visibles; textos de botones y enlaces que se entiendan solos ("Leo y entiendo"). *(Curso · UX)*
- **[S]** No agregar funciones "por si alguien las usa": cada una suma mantenimiento y distrae (Ley de Hick). Es la crítica central del práctico "Humana vs IA". *(Curso · UX)*
- **[S]** Respetar convenciones (logo → inicio, lupa → buscar), redactar para escanear (títulos, listas, párrafos cortos). *(Curso · UX)*

## 10. Seguridad y configuración

- **[B]** Ningún secreto (credenciales, claves de JWT, tokens) en el código ni en el repo. En el front solo llegan variables `VITE_*`: nunca poner secretos ahí. *(AGENTS.md, Curso · Arquitectura)*
- **[B]** `innerHTML` / `dangerouslySetInnerHTML` con datos de usuario: no (XSS). *(Curso · JS 2)*
- **[I]** Validar en el front es comodidad, no seguridad: dejar anotado que el back también valida. *(Curso · Arquitectura, Bootstrap)*
- **[I]** Cambios en `vite.config.js` (plugins que simulan API) solo para desarrollo, documentados con JSDoc y marcados para borrar cuando exista el backend. *(Repo)*

## 11. Documentación, calidad y PR

- **[B]** `npm run lint` sin errores y `npm run build` sin fallas. *(AGENTS.md)*
- **[I]** JSDoc (`/** … */` con `@param` y `@returns`) en funciones exportadas y componentes, en lugar de comentarios que expliquen el código. *(AGENTS.md)*
- **[I]** Nombres en español para carpetas, archivos, componentes, funciones y rutas (`/admin/pedidos`, `PedidosPage.jsx`). *(AGENTS.md)*
- **[I]** El PR hace una sola cosa (un issue). Sin archivos ajenos al cambio (`dist/`, `node_modules/`, `.env`, cambios de formato masivos). *(Criterio del equipo; Curso: "un cambio a la vez")*
- **[I]** Descripción del PR: qué cambia, cómo probarlo y, si se usó IA, **qué propuso, qué se corrigió y por qué**. *(Curso · Arquitectura y prácticos: "las decisiones son del equipo, no de la IA")*
- **[S]** Cada línea se puede explicar y defender. Si hay código que el autor no sabría explicar, señalarlo. *(Curso · reglas de trabajo con IA)*
