const formatoCompacto = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatoPorcentaje = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/**
 * Convierte un monto en un texto corto para ejes y etiquetas. Ej: 1234567 → "$1,2 M".
 * @param {number} monto
 * @returns {string}
 */
export function formatearMontoCorto(monto) {
  return `$${formatoCompacto.format(monto)}`;
}

/**
 * Convierte un porcentaje en texto con un decimal como máximo. Ej: 12.345 → "12,3 %".
 * @param {number} porcentaje
 * @returns {string}
 */
export function formatearPorcentaje(porcentaje) {
  return `${formatoPorcentaje.format(porcentaje)} %`;
}

/**
 * Convierte un día `"AAAA-MM-DD"` en `"DD/MM"`, sin pasar por `Date` (que lo tomaría en UTC).
 * @param {string} dia
 * @returns {string}
 */
export function formatearDiaCorto(dia) {
  const [, mes, numero] = dia.split("-");
  return `${numero}/${mes}`;
}

/**
 * Convierte una diferencia entre tasas en puntos porcentuales. Ej: 2.345 → "2,3 p.p.".
 * @param {number} puntos
 * @returns {string}
 */
export function formatearPuntosPorcentuales(puntos) {
  return `${formatoPorcentaje.format(puntos)} p.p.`;
}

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
