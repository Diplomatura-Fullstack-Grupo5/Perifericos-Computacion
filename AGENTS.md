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

### Frontend

Código en `frontend/src/`:

- `App.jsx`: definición de rutas.
- `api/`: cliente HTTP (`http.js` con `fetch` y el JWT) y un archivo por recurso. Los componentes no
  llaman a `fetch` directamente; pasan por `api/`.
- `context/`: estado global: `AuthContext`, `CarritoContext`, `ComparadorContext`.
- `components/`: componentes reutilizables (p. ej. `TarjetaProducto`, `TablaSpecs`).
- `pages/`: una página por ruta; las del panel admin en `pages/admin/`.
- `styles/`: estilos.

## Comandos (desde `frontend/`)

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run lint`: ESLint
- `npm run preview`: previsualizar el build

## Convenciones

- Nombres de dominio, archivos, componentes y rutas en español, siguiendo la estructura de arriba
  (`productos`, `pedidos`, `Catalogo.jsx`, `Comparador.jsx`, etc.).
- Secretos (credenciales de PostgreSQL, clave del JWT) solo en variables de entorno, nunca en el
  código ni en el repositorio. En el frontend, solo las variables con prefijo `VITE_` llegan al
  navegador, así que nunca pongas secretos ahí.
- Como React Compiler está activo, no añadas `useMemo`, `useCallback` ni `React.memo` manualmente
  salvo que haya un motivo medido.
- Diseño visual: azul como color de acción, verde para estados positivos y "mejor valor", fondo claro
  y tipografía del sistema.

## Skills

Las skills del proyecto están en `.claude/skills/` (las leen tanto Claude Code como OpenCode).
