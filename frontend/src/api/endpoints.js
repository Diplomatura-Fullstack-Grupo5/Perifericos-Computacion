/**
 * Dirección base de los datos. Hoy apunta a los JSON de /database (servidos por el plugin
 * servirDatabase de vite.config.js). Con el backend real pasará a ser la URL de la API.
 */
export const URL_BASE = "/database";

/**
 * Rutas de cada recurso, relativas a URL_BASE. Las de lectura apuntan a los archivos JSON; las de
 * escritura ya tienen la forma REST que tendrá la API (`/productos`, `/productos/:id`,
 * `/pedidos/:id/estado`, `/usuarios/:id/rol`).
 */
export const ENDPOINTS = {
  productos: "/productos.json",
  crearProducto: "/productos",
  producto: (id) => `/productos/${id}`,
  marcas: "/marcas.json",
  categorias: "/categorias.json",
  usuarios: "/usuarios.json",
  pedidos: "/pedidos.json",
  crearPedido: "/pedidos",
  estadoPedido: (id) => `/pedidos/${id}/estado`,
  registrarUsuario: "/usuarios/registro",
  usuario: (id) => `/usuarios/${id}`,
  rolUsuario: (id) => `/usuarios/${id}/rol`,
  iniciarSesion: "/usuarios/inicio-sesion",
};
