import { URL_BASE } from "./endpoints";

/**
 * Hace una petición GET y devuelve la respuesta como JSON. Este archivo es el único que usa fetch.
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

/**
 * Envía datos a la API (alta, modificación o baja) y devuelve la respuesta como JSON.
 * @param {string} endpoint Ruta relativa a URL_BASE (usar las de ENDPOINTS).
 * @param {object} [datos] Datos a enviar en el cuerpo, como JSON.
 * @param {"POST" | "PUT" | "PATCH" | "DELETE"} [metodo]
 * @returns {Promise<any>} Lo que devuelve el servidor, o `null` si responde sin contenido (204).
 * @throws {Error} Si la respuesta no es exitosa, con el mensaje que manda el servidor si lo hay y
 *   el código HTTP en `error.status`.
 */
export async function enviar(endpoint, datos, metodo = "POST") {
  const response = await fetch(`${URL_BASE}${endpoint}`, {
    method: metodo,
    headers: datos === undefined ? undefined : { "Content-Type": "application/json" },
    body: datos === undefined ? undefined : JSON.stringify(datos),
  });

  const respuesta = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(respuesta?.message ?? `Error ${response.status} al enviar ${endpoint}`);
    error.status = response.status;
    throw error;
  }

  return respuesta;
}
