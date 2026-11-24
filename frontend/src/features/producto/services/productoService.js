import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/**
 * Obtiene un producto por su id. Simula `GET /api/productos/:id`.
 * @param {number | string} id Id del producto (puede venir como texto desde la URL).
 * @returns {Promise<object | null>} El producto, o `null` si no existe.
 */
export async function obtenerProducto(id) {
  const data = await pedir(ENDPOINTS.productos);
  return data.find((product) => product.id === Number(id)) ?? null;
}

/**
 * Obtiene las definiciones de specs de una categoría (etiqueta, unidad, regla, etc.).
 * Simula `GET /api/categorias/:categoria/specs`.
 * @param {string} category Categoría (ej. "Mouses").
 * @returns {Promise<Object<string, object>>} Ej. `{ weight_g: { label: "Peso", unit: "g", ... } }`.
 *   Objeto vacío si la categoría no existe.
 */
export async function obtenerDefinicionesSpecs(category) {
  const data = await pedir(ENDPOINTS.categorias);
  return data[category] ?? {};
}
