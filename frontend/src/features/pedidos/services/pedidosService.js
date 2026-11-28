import { enviar, pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/** Cantidad de pedidos por página del listado. */
export const PEDIDOS_POR_PAGINA = 20;

/** Estados de un pedido, en el orden en que avanza. */
export const ESTADOS_PEDIDO = ["pendiente", "enviado", "entregado", "cancelado"];

/** Medios de pago que acepta la tienda, en un orden fijo (cada uno tiene su color en el dashboard). */
export const MEDIOS_DE_PAGO = ["Tarjeta de crédito", "Mercado Pago", "Tarjeta de débito", "Transferencia"];

/**
 * Estados a los que puede pasar un pedido desde cada estado: avanza pendiente → enviado → entregado
 * y se puede cancelar mientras no se haya entregado.
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
 * Indica si un pedido coincide con el texto buscado: nombre del cliente o número (con o sin `#`).
 * @param {object} pedido
 * @param {string} texto En minúsculas. Vacío = coincide.
 * @returns {boolean}
 */
function coincideBusqueda(pedido, texto) {
  const numero = texto.startsWith("#") ? texto.slice(1) : texto;
  return pedido.customer.toLowerCase().includes(texto) || String(pedido.id) === numero;
}

/**
 * Obtiene una página de los pedidos que coinciden con la búsqueda, el estado y el medio de pago,
 * del más nuevo al más viejo. Simula `GET /api/pedidos?busqueda=&estado=&pago=&pagina=` (admin).
 * @param {object} [filtros]
 * @param {string} [filtros.busqueda] Cliente o número de pedido. Vacío = sin filtro.
 * @param {string} [filtros.estado] Uno de `ESTADOS_PEDIDO`. Vacío = todos.
 * @param {string} [filtros.pago] Uno de `MEDIOS_DE_PAGO`. Vacío = todos.
 * @param {number} [filtros.pagina] Número de página, empezando en 1.
 * @returns {Promise<{ pedidos: object[], total: number, porEstado: Object<string, number> }>} Los
 *   pedidos de la página, el total que coincide con los filtros y cuántos hay en cada estado (sin
 *   aplicar el filtro de estado).
 */
export async function obtenerPedidos({ busqueda = "", estado = "", pago = "", pagina = 1 } = {}) {
  const data = await pedir(ENDPOINTS.pedidos);
  const texto = busqueda.trim().toLowerCase();

  const sinFiltroDeEstado = data
    .filter((pedido) => !texto || coincideBusqueda(pedido, texto))
    .filter((pedido) => !pago || pedido.paymentMethod === pago);

  const porEstado = {};
  ESTADOS_PEDIDO.forEach((nombre) => {
    porEstado[nombre] = sinFiltroDeEstado.filter((pedido) => pedido.status === nombre).length;
  });

  const filtrados = sinFiltroDeEstado
    .filter((pedido) => !estado || pedido.status === estado)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const inicio = (pagina - 1) * PEDIDOS_POR_PAGINA;
  return {
    pedidos: filtrados.slice(inicio, inicio + PEDIDOS_POR_PAGINA),
    total: filtrados.length,
    porEstado,
  };
}

/**
 * Obtiene los pedidos asociados al id de un usuario.
 * @param {number} userId
 * @returns {Promise<object[]>}
 */
export async function obtenerPedidosUsuario(userId) {
  const data = await pedir(ENDPOINTS.pedidos);
  return data
    .filter((pedido) => pedido.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Cambia el estado de un pedido. Simula `PATCH /api/pedidos/:id/estado` (admin). Solo permite los
 * pasos de `TRANSICIONES` (ej. no se puede reabrir un pedido cancelado), como hará el backend.
 * @param {object} pedido Se usa su `id` y su `status` actual.
 * @param {string} estadoNuevo
 * @returns {Promise<object>} El pedido actualizado.
 * @throws {Error} Si el cambio no está permitido o el servidor responde con error.
 */
export async function cambiarEstadoPedido(pedido, estadoNuevo) {
  if (!obtenerEstadosSiguientes(pedido.status).includes(estadoNuevo)) {
    throw new Error(`Un pedido ${pedido.status} no puede pasar a ${estadoNuevo}.`);
  }
  return enviar(ENDPOINTS.estadoPedido(pedido.id), { status: estadoNuevo }, "PATCH");
}
