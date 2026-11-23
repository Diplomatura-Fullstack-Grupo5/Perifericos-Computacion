import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

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
