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
