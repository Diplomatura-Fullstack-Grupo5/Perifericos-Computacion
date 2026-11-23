/**
 * Dirección base de los datos. Hoy apunta a los JSON de /database (servidos por el plugin
 * servirDatabase de vite.config.js). Con el backend real pasará a ser la URL de la API.
 */
export const URL_BASE = "/database";

/** Rutas de cada recurso, relativas a URL_BASE. */
export const ENDPOINTS = {
  productos: "/productos.json",
  marcas: "/marcas.json",
  categorias: "/categorias.json",
};
