import { URL_BASE } from "./endpoints";

/**
 * Hace una petición GET y devuelve la respuesta como JSON. Es el único fetch de la aplicación.
 * @param {string} endpoint Ruta relativa a URL_BASE (usar las de ENDPOINTS).
 * @returns {Promise<any>}
 * @throws {Error} Si la respuesta no es exitosa.
 */
export async function pedir(endpoint) {
  const response = await fetch(`${URL_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} al pedir ${endpoint}`);
  }

  return response.json();
}
