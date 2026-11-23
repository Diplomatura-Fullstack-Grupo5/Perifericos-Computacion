import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/**
 * Obtiene los nombres de las categorías, en el orden de categorias.json.
 * @returns {Promise<string[]>}
 */
export async function obtenerCategorias() {
  const data = await pedir(ENDPOINTS.categorias);
  return Object.keys(data);
}

/**
 * Obtiene los productos más vendidos, de mayor a menor cantidad de unidades vendidas.
 * Simula `GET /api/productos/mas-vendidos?limite=...`.
 * @param {object} [params]
 * @param {number} [params.limite] Cantidad de productos a devolver.
 * @returns {Promise<object[]>}
 */
export async function obtenerMasVendidos({ limite = 8 } = {}) {
  const data = await pedir(ENDPOINTS.productos);
  return [...data].sort((a, b) => b.sold - a.sold).slice(0, limite);
}
