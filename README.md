# PuntoTech

E-commerce de periféricos de computación: teclados, mouses, monitores, auriculares, webcams y más.
Proyecto Integrador del Grupo 5.

## El problema

Quien compra periféricos suele decidir por especificaciones técnicas. Un mouse gamer se elige por
sensor y peso, y un monitor por panel y tasa de refresco. En la mayoría de las tiendas esos datos
aparecen como texto libre en la descripción, así que hay que abrir varias pestañas y comparar a mano.

PuntoTech guarda las especificaciones de cada producto (DPI, switches, tasa de refresco,
conectividad, latencia, etc.) como **datos estructurados**. Con eso se puede filtrar el catálogo por
especificaciones y comparar productos automáticamente, en un **comparador lado a lado** que resalta
las diferencias.

## Público objetivo

- **Clientes:** gamers, estudiantes y profesionales que arman o mejoran su puesto de trabajo y
  quieren comparar opciones técnicas antes de comprar.
- **Administradores:** personal de la tienda que carga productos, mantiene stock y precios y
  gestiona los pedidos.

## Funcionalidades

### Sitio público

- Catálogo con búsqueda y filtros por categoría, marca, precio y especificaciones.
- Ficha de producto con galería, precio, stock y tabla de especificaciones técnicas.
- Comparador de hasta 4 productos de la misma categoría, que resalta las diferencias y el mejor
  valor de cada especificación.
- Carrito de compras y confirmación de pedido.
- Registro, inicio de sesión e historial de pedidos.

### Panel de administración

- Dashboard con ventas, pedidos, ticket promedio, productos más comparados y alertas de stock bajo.
- Alta, baja y modificación de productos con sus especificaciones, categorías y marcas.
- Gestión de pedidos y cambio de estado.
- Gestión de usuarios y roles (cliente / administrador).

## Tecnologías

| Capa          | Tecnología                                            |
| ------------- | ----------------------------------------------------- |
| Frontend      | React + Vite (sitio público y panel admin en una SPA) |
| Backend       | API REST en Node.js + Express                         |
| Base de datos | PostgreSQL                                            |
| Autenticación | JWT y contraseñas hasheadas con bcrypt                |

## Arquitectura

Cliente-servidor en tres niveles:

```
Frontend (React + Vite)  ──HTTP/JSON──▶  API REST (Node.js + Express)  ──SQL──▶  PostgreSQL
```

El backend es un **monolito modular por dominio**: un módulo por área (productos, comparador,
catálogo, pedidos, usuarios, dashboard), y dentro de cada uno, cuatro capas:

- **routes:** define los endpoints.
- **controller:** traduce entre HTTP y datos.
- **service:** aplica las reglas de negocio.
- **repository:** hace las consultas SQL.

Con esta organización, cada integrante puede trabajar en un módulo con pocos conflictos y todo lo de
un dominio queda en un solo lugar. Además, hay un único despliegue y una única base de datos.

## Estructura del repositorio

| Carpeta     | Contenido                      |
| ----------- | ------------------------------ |
| `frontend/` | Aplicación React + Vite        |
| `backend/`  | API REST (en preparación)      |
| `database/` | Base de datos (en preparación) |

## Cómo ejecutar el frontend

Requiere Node.js. Desde la carpeta `frontend/`:

```bash
npm install
npm run dev
```

## Equipo

Grupo 5: Florencia Bordagorry, German Altamirano, Pedro Risma y Santiago Masramón.
