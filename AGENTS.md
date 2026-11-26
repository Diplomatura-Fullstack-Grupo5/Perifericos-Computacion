# Instrucciones para agentes de IA

Este archivo es la fuente única de instrucciones del proyecto para cualquier agente de IA
(OpenCode lo lee directamente; Claude Code lo importa desde `CLAUDE.md`).
Edita las instrucciones aquí, no en `CLAUDE.md`.

## Proyecto

**PuntoTech**: e-commerce de periféricos de computación (teclados, mouses, monitores, auriculares,
webcams, etc.). Proyecto integrador académico.

Lo que distingue al sistema: cada producto guarda sus **especificaciones técnicas como datos
estructurados** (DPI, switches, tasa de refresco, conectividad, latencia, etc.), no como texto libre.
Eso permite filtrar por especificaciones y tener un **comparador lado a lado** que resalta
diferencias y el mejor valor. Cualquier decisión de modelo de datos o de UI debe preservar esto.

### Funcionalidades

Sitio público (clientes):

- Catálogo con búsqueda y filtros por categoría, marca, precio y especificaciones. Los filtros de
  especificaciones se generan a partir de las specs de la categoría.
- Ficha de producto con galería, precio, stock y tabla de especificaciones.
- Comparador de hasta 4 productos **de la misma categoría**: marca las specs que difieren y el mejor
  valor de cada una según su regla (mayor es mejor o menor es mejor).
- Carrito y confirmación de pedido.
- Registro, inicio de sesión e historial de pedidos.

Panel de administración:

- Dashboard: ventas, pedidos, ticket promedio, productos más comparados y alertas de stock bajo.
- ABM de productos con sus especificaciones, categorías y marcas.
- Gestión de pedidos y cambio de estado.
- Gestión de usuarios y roles (`cliente` / `administrador`).

## Stack

- `frontend/`: SPA en React 19 + Vite 8, en JavaScript (`.jsx`), con React Compiler activado
  (`babel-plugin-react-compiler` vía `@rolldown/plugin-babel` en `vite.config.js`). Incluye el sitio
  público y el panel admin.
  - React Router (`react-router`) para las rutas.
  - Bootstrap 5 (CSS y `bootstrap.bundle` JS, importados en `app/main.jsx`) para estilos y
    componentes como dropdowns y collapse.
  - Bootstrap Icons (`bootstrap-icons`, clases `bi bi-<nombre>`) para los iconos.
- `database/`: JSON con datos de práctica que hoy hacen de API (ver "Datos de práctica").
- `backend/`: API REST en Node.js + Express (todavía sin código).
- Base de datos relacional PostgreSQL, accedida con `pg` mediante un único `Pool` compartido.
- Autenticación con JWT; contraseñas hasheadas con bcrypt.

## Arquitectura

Cliente-servidor en tres niveles: frontend (presentación) ↔ HTTP/JSON ↔ API REST (lógica) ↔ SQL ↔
PostgreSQL (datos).

### Backend: monolito modular por dominio

Código en `backend/src/`:

- `app.js` arma Express; `server.js` levanta el puerto.
- `config/`: variables de entorno y el `Pool` de base de datos (singleton).
- `middlewares/`: `auth` (verifica JWT), `requiereRol`, `validar`, `errores`. Orden en la cadena:
  cors → json → auth → rol → validación → errores.
- `modules/<dominio>/`: un módulo por dominio: `productos` (incluye especificaciones),
  `comparador`, `catalogo` (categorías y marcas), `pedidos` (carrito y órdenes), `usuarios`
  (auth y roles), `dashboard` (métricas admin).
- `shared/`: utilidades comunes.

Cada módulo tiene cuatro capas, en archivos `<dominio>.<capa>.js`:

1. `routes`: define endpoints y qué middlewares aplican.
2. `controller`: traduce HTTP ↔ datos. Sin reglas de negocio ni SQL.
3. `service`: reglas de negocio.
4. `repository`: consultas SQL. Es el único lugar con SQL.

Reglas:

- Cada capa llama solo a la siguiente (routes → controller → service → repository).
- **Un módulo nunca importa el `repository` de otro.** Si necesita datos de otro dominio, llama al
  `service` de ese módulo.
- Usar siempre consultas parametrizadas (`$1`, `$2`, …); nunca concatenar valores en el SQL.
- Las rutas del panel admin se protegen con `auth` + `requiereRol` en el backend; ocultarlas en el
  frontend no alcanza.

### Frontend: organizado por funcionalidad (features)

Código en `frontend/src/`:

```
src/
├── app/                  # arma la aplicación
│   ├── main.jsx          # punto de entrada: Bootstrap, index.css y <App />
│   ├── App.jsx           # monta el router
│   ├── router.jsx        # rutas (y más adelante loaders: protegerRuta, redirigirSiHaySesion)
│   └── layouts/          # LayoutPublico, LayoutPrivado (panel admin, rutas /admin/*)
├── api/
│   ├── endpoints.js      # URL_BASE + ENDPOINTS de cada recurso
│   └── cliente.js        # pedir() y enviar(): los únicos fetch de la aplicación
├── features/             # un módulo por funcionalidad
│   └── <feature>/        # catalogo, producto, comparador, carrito, pedidos, auth, productos…
│       ├── components/   # componentes propios de la feature (con su .css al lado)
│       ├── pages/        # una página por ruta (<Nombre>Page.jsx)
│       ├── services/     # <feature>Service.js: obtiene datos usando api/cliente.js
│       ├── hooks/        # hooks propios, si hacen falta (useComparador, useCarrito…)
│       └── index.js      # lo que la feature expone hacia afuera (sus páginas)
├── shared/               # lo genérico: no conoce ninguna feature
│   ├── components/       # atoms (Spinner, Boton…), molecules (MensajeVacio…), organisms (Navbar…)
│   ├── hooks/            # useFetch, useLocalStorage…
│   └── utils/            # formatearPrecio, formatearValorSpec…
├── assets/
└── index.css             # estilos globales
```

Reglas:

- **Solo `api/cliente.js` hace `fetch`.** Los componentes piden datos a los `services` de su feature,
  y los services usan `pedir()` con las rutas de `ENDPOINTS`.
- Una feature no importa archivos internos de otra; usa lo que esa feature exporta en su
  `index.js`. Si algo lo necesitan varias features, va a `shared/`.
- `shared/` nunca importa nada de `features/`.
- Un componente que usa una sola feature vive en esa feature, aunque sea genérico. Se mueve a
  `shared/` cuando otra feature lo necesite.
- El estado vive en el componente más bajo que lo necesita. Estado global (sesión, carrito,
  comparador) en un contexto o hook de su feature.
- Lo que cambia por una acción del usuario se actualiza en el manejador del evento, no en un
  `useEffect`. Los `useEffect` que piden datos ignoran respuestas viejas con una función de
  limpieza.
- Bootstrap JS (`data-bs-toggle`) solo abre/cierra elementos (dropdown, collapse); qué se muestra lo
  decide el estado de React. No controlar lo mismo con los dos.
- El panel admin **no es una feature**: "admin" es un tipo de usuario. Cada sección del panel va en
  la feature de su dominio, con los mismos nombres que los módulos del backend (`productos`,
  `pedidos`, `usuarios`, `dashboard`), y sus rutas cuelgan de `/admin` con el `LayoutPrivado`.

### Datos de práctica (`database/`)

Mientras no hay backend, `database/*.json` hace de API. El plugin `servirDatabase()` de
`vite.config.js` los sirve en `/database/*` (solo en `npm run dev` y `npm run preview`). Cuando
exista la API real, se cambia `URL_BASE` en `api/endpoints.js` y la lógica que hoy simula al
servidor dentro de los services (filtrar, ordenar, calcular opciones de filtro) pasa al backend.

Escrituras: `enviar(endpoint, datos, metodo)` de `api/cliente.js` manda `POST`, `PUT` o `DELETE`, y
`servirDatabase()` los simula sobre las colecciones de `COLECCIONES_EDITABLES` (hoy `productos`):
`POST /database/productos` agrega con el id siguiente, `PUT /database/productos/:id` modifica y
`DELETE /database/productos/:id` borra, **escribiendo el archivo JSON**. Las reglas de negocio
(validar, valores iniciales) van en el service de la feature, no en `vite.config.js`. Los datos
que se cargan probando no se commitean: descartarlos con `git checkout database/`.

- `productos.json`: lista plana de productos. `specs` guarda solo **clave → valor**
  (`{ "weight_g": 60, "connectivity": "Inalámbrico" }`): números como números, la unidad va en el
  nombre de la clave, `null` = no aplica. Todos los productos de una categoría tienen las mismas
  claves.
- `categorias.json`: por categoría, la **definición de cada spec**: `label`, `type` (`"number"` /
  `"boolean"` / `"text"`, el tipo del valor y el control del formulario del panel), `unit`, `featured`
  (se muestra en la tarjeta), `rule` (`"higher"` / `"lower"` para el mejor valor del comparador;
  sin `rule` no hay ganador) y `filter` (`"checkbox"` / `"range"`; sin `filter` no se filtra). El
  orden de las claves es el orden en que se muestran.
- Además de `specs`, cada producto guarda `sold` (unidades vendidas en los pedidos no
  cancelados de `pedidos.json`, para "más vendidos") y
  `compared` (veces que se agregó al comparador, para "más comparados" del dashboard). Ambos los
  calcula el sistema: el ABM los inicia en 0 y no los edita.
- `pedidos.json`: pedidos con `customer`, `createdAt` (ISO), `status` (`"pendiente"` / `"enviado"`
  / `"entregado"` / `"cancelado"`), `paymentMethod` (`"Tarjeta de crédito"` / `"Mercado Pago"` /
  `"Tarjeta de débito"` / `"Transferencia"`), `items` (`productId`, `name`, `price`, `quantity`: copia del
  producto al momento de la compra) y `total`. Los cancelados no suman ventas.
- `marcas.json`: marcas por categoría. Se mantiene a mano: una marca nueva en `productos.json`
  también va aquí.
- Las imágenes de producto están en `frontend/public/images/products/`, en `.webp`. Deben tener
  **fondo blanco o transparente**: la interfaz usa `mix-blend-mode: multiply` para fundir el fondo
  con el recuadro, y una foto con ambiente o fondo de color se vería como un rectángulo.

## Comandos (desde `frontend/`)

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run lint`: ESLint
- `npm run preview`: previsualizar el build

## Convenciones

- Nombres de carpetas, archivos, componentes, funciones exportadas y rutas en español, siguiendo
  la estructura de arriba (`catalogo`, `CatalogoPage.jsx`, `TarjetaProducto`, `obtenerProductos`).
  Las claves de los datos (`name`, `price`, `specs`…) y las props que las reciben están en inglés.
- El CSS de un componente vive junto a él, con el mismo nombre (`TarjetaProducto.jsx` +
  `TarjetaProducto.css`). Usar clases con prefijo propio, porque el CSS importado es global.
- Documentar las funciones y componentes con JSDoc (`/** … */` con `@param` y `@returns`) en lugar
  de comentarios que expliquen el código.
- Antes de cada commit, `npm run lint` sin errores.
- Secretos (credenciales de PostgreSQL, clave del JWT) solo en variables de entorno, nunca en el
  código ni en el repositorio. En el frontend, solo las variables con prefijo `VITE_` llegan al
  navegador, así que nunca pongas secretos ahí.
- Como React Compiler está activo, no añadas `useMemo`, `useCallback` ni `React.memo` manualmente
  salvo que haya un motivo medido.
- Diseño visual: azul como color de acción, verde para estados positivos y "mejor valor", fondo claro
  y tipografía del sistema.

## Skills

Las skills del proyecto están en `.claude/skills/` (las leen tanto Claude Code como OpenCode).

- `revisar-pr`: code review previo a pedirle la revisión del PR al equipo (se activa pidiendo
  "hacé un code review" o "revisá mi rama"). Su criterio está en
  `.claude/skills/revisar-pr/checklist.md`: buenas prácticas del curso, este archivo y la
  arquitectura del repo.
- `react-vite-best-practices`: guía externa de rendimiento. Si contradice al curso o a este archivo,
  mandan el curso y este archivo.
