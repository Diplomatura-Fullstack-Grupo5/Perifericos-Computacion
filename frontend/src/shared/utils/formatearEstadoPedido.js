/** Texto y color (clases de Bootstrap) de cada estado de pedido. */
const ESTADOS_PEDIDO = {
  pendiente: { texto: "Pendiente", clases: "text-bg-warning" },
  enviado: { texto: "Enviado", clases: "text-bg-primary" },
  entregado: { texto: "Entregado", clases: "text-bg-success" },
  cancelado: { texto: "Cancelado", clases: "text-bg-secondary" },
};

/**
 * Devuelve el texto y las clases de la etiqueta (`badge`) de un estado de pedido.
 * @param {string} estado `"pendiente"`, `"enviado"`, `"entregado"` o `"cancelado"`.
 * @returns {{ texto: string, clases: string }}
 */
export function formatearEstadoPedido(estado) {
  return ESTADOS_PEDIDO[estado] ?? { texto: estado, clases: "text-bg-light" };
}
