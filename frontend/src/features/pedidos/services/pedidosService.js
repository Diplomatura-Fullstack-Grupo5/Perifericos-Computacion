import { enviar, pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/** Estados de un pedido, en el orden en que avanza. */
export const ESTADOS_PEDIDO = ["pendiente", "enviado", "entregado", "cancelado"];

/** Medios de pago que acepta la tienda. */
export const MEDIOS_DE_PAGO = ["Tarjeta de crédito", "Mercado Pago", "Tarjeta de débito", "Transferencia"];

/**
 * Estados a los que puede pasar un pedido desde cada estado. Un pedido avanza
 * pendiente → enviado → entregado y se puede cancelar mientras no se haya entregado.
 * Entregado y cancelado son finales.
 */
const TRANSICIONES = {
  pendiente: ["enviado", "cancelado"],
  enviado: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

/**
 * Devuelve los estados a los que puede pasar un pedido que está en `estado`.
 * @param {string} estado
 * @returns {string[]} Vacío si el estado es final.
 */
export function obtenerEstadosSiguientes(estado) {
  return TRANSICIONES[estado] ?? [];
}

/**
 * Indica si un pedido coincide con el texto buscado: por nombre del cliente o por número de pedido
 * (con o sin `#`).
 * @param {object} pedido
 * @param {string} texto Ya en minúsculas y sin espacios en los extremos. Vacío = coincide.
 * @returns {boolean}
 */
function coincideBusqueda(pedido, texto) {
  if (!texto) return true;
  const numero = texto.replace(/^#/, "");
  return (
    pedido.customer.toLocaleLowerCase("es").includes(texto) ||
    (numero !== "" && String(pedido.id) === numero)
  );
}

/**
 * Obtiene los pedidos del panel que coinciden con la búsqueda, el estado y el medio de pago, del más
 * nuevo al más viejo. Simula `GET /api/pedidos?busqueda=&estado=&pago=` (admin).
 * @param {object} [filtros]
 * @param {string} [filtros.busqueda] Cliente o número de pedido. Vacío = sin filtro.
 * @param {string} [filtros.estado] Uno de `ESTADOS_PEDIDO`. Vacío = todos.
 * @param {string} [filtros.pago] Uno de `MEDIOS_DE_PAGO`. Vacío = todos.
 * @returns {Promise<{ pedidos: object[], total: number, porEstado: Object<string, number> }>} Los
 *   que coinciden, el total sin filtrar y cuántos hay en cada estado con la búsqueda y el medio de
 *   pago elegidos (sin aplicar el filtro de estado).
 */
export async function obtenerPedidos({ busqueda = "", estado = "", pago = "" } = {}) {
  const data = await pedir(ENDPOINTS.pedidos);
  const texto = busqueda.trim().toLocaleLowerCase("es");

  const sinFiltroDeEstado = data
    .filter((pedido) => !pago || pedido.paymentMethod === pago)
    .filter((pedido) => coincideBusqueda(pedido, texto));

  const porEstado = Object.fromEntries(
    ESTADOS_PEDIDO.map((nombre) => [
      nombre,
      sinFiltroDeEstado.filter((pedido) => pedido.status === nombre).length,
    ]),
  );

  const pedidos = sinFiltroDeEstado
    .filter((pedido) => !estado || pedido.status === estado)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { pedidos, total: data.length, porEstado };
}

/**
 * Cambia el estado de un pedido. Simula `PATCH /api/pedidos/:id/estado` (admin).
 * Solo permite los pasos de `TRANSICIONES` (ej. no se puede reabrir un pedido cancelado), como hará
 * el backend.
 * @param {object} pedido El pedido tal como se muestra (se usa su `id` y su `status` actual).
 * @param {string} estadoNuevo Uno de los que devuelve `obtenerEstadosSiguientes(pedido.status)`.
 * @returns {Promise<object>} El pedido actualizado.
 * @throws {Error} Si el cambio de estado no está permitido o el servidor responde con error.
 */
export async function cambiarEstadoPedido(pedido, estadoNuevo) {
  if (!obtenerEstadosSiguientes(pedido.status).includes(estadoNuevo)) {
    throw new Error(`Un pedido ${pedido.status} no puede pasar a ${estadoNuevo}.`);
  }
  return enviar(ENDPOINTS.estadoPedido(pedido.id), { status: estadoNuevo }, "PATCH");
}
