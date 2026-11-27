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

/**
 * @typedef {object} CambioCarrito Diferencia entre el carrito y los productos actuales.
 * @property {"precio" | "stock" | "sinStock" | "eliminado"} tipo `stock`: no alcanza para la
 *   cantidad elegida; `sinStock`: no queda ninguna unidad; `eliminado`: el producto ya no existe.
 * @property {string} name Nombre del producto.
 * @property {number} [price] Precio nuevo (solo en `precio`).
 */

/**
 * Compara el carrito con los productos actuales y lista lo que cambió desde que se agregaron.
 * @param {{id: number, name: string, price: number, quantity: number}[]} items Productos del carrito.
 * @param {Map<number, object>} productosPorId Productos actuales.
 * @returns {CambioCarrito[]} Vacío si el pedido se puede confirmar tal cual.
 */
function buscarCambios(items, productosPorId) {
  const cambios = [];
  items.forEach((item) => {
    const actual = productosPorId.get(item.id);
    if (!actual) {
      cambios.push({ tipo: "eliminado", name: item.name });
      return;
    }
    if (actual.stock <= 0) {
      cambios.push({ tipo: "sinStock", name: actual.name });
      return;
    }
    if (actual.stock < item.quantity) cambios.push({ tipo: "stock", name: actual.name });
    if (actual.price !== item.price) {
      cambios.push({ tipo: "precio", name: actual.name, price: actual.price });
    }
  });
  return cambios;
}

/**
 * Crea un pedido con los productos del carrito. Simula `POST /api/pedidos`, que en el backend hará
 * todo dentro de una transacción.
 *
 * Antes de guardar revisa los productos actuales: si alguno cambió de precio, no tiene stock
 * suficiente o ya no existe, **no guarda nada** y devuelve los cambios junto con los datos actuales,
 * para que el cliente revise el carrito y vuelva a confirmar. Si está todo bien, guarda el pedido
 * como "pendiente" con los precios actuales y descuenta el stock de cada producto. Si el pedido se
 * guardó pero falla el descuento de stock, igual lo devuelve como confirmado y registra el error: si
 * lo informara como fallido, el cliente reintentaría y se crearía un pedido duplicado.
 *
 * Validar en el navegador es una comodidad, no una medida de seguridad: el backend tiene que volver
 * a validar los datos del comprador (obligatorios, formatos, medio de pago) y las cantidades
 * (enteros mayores a 0), porque cualquiera puede mandar un pedido sin pasar por este formulario.
 * @param {object} comprador Datos del formulario.
 * @param {string} comprador.name
 * @param {string} comprador.email
 * @param {string} comprador.phone
 * @param {string} comprador.address
 * @param {string} comprador.city
 * @param {string} comprador.postalCode
 * @param {string} comprador.paymentMethod Uno de `MEDIOS_DE_PAGO`.
 * @param {{id: number, name: string, price: number, quantity: number}[]} items Productos del carrito.
 * @param {{ id: number } | null} [usuario] Usuario con sesión iniciada: el pedido guarda su `id` en
 *   `userId` (para "Mis pedidos"). Sin sesión, `userId` queda en `null`. En el backend el id sale del
 *   JWT, no de lo que manda el navegador.
 * @returns {Promise<{ pedido: object } | { cambios: CambioCarrito[], productosActuales: object[] }>}
 * @throws {Error} Si el carrito está vacío, el medio de pago no es válido o el servidor falla al
 *   leer los productos o al guardar el pedido.
 */
export async function crearPedido(comprador, items, usuario = null) {
  if (items.length === 0) throw new Error("El carrito está vacío.");
  if (!MEDIOS_DE_PAGO.includes(comprador.paymentMethod)) {
    throw new Error("Elegí un medio de pago válido.");
  }

  const productos = await pedir(ENDPOINTS.productos);
  const productosPorId = new Map(productos.map((producto) => [producto.id, producto]));

  const cambios = buscarCambios(items, productosPorId);
  if (cambios.length > 0) {
    const productosActuales = items
      .map((item) => productosPorId.get(item.id))
      .filter(Boolean);
    return { cambios, productosActuales };
  }

  const itemsPedido = items.map(({ id, quantity }) => {
    const { name, price } = productosPorId.get(id);
    return { productId: id, name, price, quantity };
  });

  const pedido = await enviar(ENDPOINTS.crearPedido, {
    userId: usuario?.id ?? null,
    customer: comprador.name,
    email: comprador.email,
    phone: comprador.phone,
    shipping: {
      address: comprador.address,
      city: comprador.city,
      postalCode: comprador.postalCode,
    },
    createdAt: new Date().toISOString(),
    status: "pendiente",
    paymentMethod: comprador.paymentMethod,
    items: itemsPedido,
    total: itemsPedido.reduce((total, item) => total + item.price * item.quantity, 0),
  });

  try {
    await Promise.all(
      itemsPedido.map(({ productId, quantity }) =>
        enviar(
          ENDPOINTS.producto(productId),
          { stock: productosPorId.get(productId).stock - quantity },
          "PUT",
        ),
      ),
    );
  } catch (err) {
    console.error(`Pedido #${pedido.id} guardado, pero no se pudo descontar el stock:`, err);
  }

  return { pedido };
}
