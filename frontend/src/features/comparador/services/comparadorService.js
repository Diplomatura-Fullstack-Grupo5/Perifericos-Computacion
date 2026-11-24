import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/**
 * Obtiene varios productos por sus ids, en el mismo orden. Los ids que no existen se omiten.
 * Simula `GET /api/productos?ids=3,7,12`.
 * @param {number[]} ids
 * @returns {Promise<object[]>}
 */
export async function obtenerProductosPorIds(ids) {
  const data = await pedir(ENDPOINTS.productos);
  return ids
    .map((id) => data.find((product) => product.id === id))
    .filter(Boolean);
}

/**
 * Obtiene las definiciones de specs de una categoría (etiqueta, unidad, regla, etc.).
 * Simula `GET /api/categorias/:categoria/specs`.
 * @param {string} category Categoría (ej. "Mouses").
 * @returns {Promise<Object<string, object>>} Objeto vacío si la categoría no existe.
 */
export async function obtenerDefinicionesSpecs(category) {
  const data = await pedir(ENDPOINTS.categorias);
  return data[category] ?? {};
}
