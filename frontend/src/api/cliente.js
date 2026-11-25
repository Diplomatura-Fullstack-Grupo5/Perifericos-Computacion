import { URL_BASE } from "./endpoints";

/**
 * Funciones para comunicarse con la API. Este es el único archivo que usa fetch.
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
 * Envía datos JSON mediante POST y devuelve la respuesta.
 * @param {string} endpoint Ruta absoluta de la API.
 * @param {object} datos Datos que se enviarán.
 * @returns {Promise<any>}
 * @throws {Error} Si la respuesta no es exitosa.
 */
export async function enviar(endpoint, datos) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message ?? `Error ${response.status} al enviar ${endpoint}`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}
