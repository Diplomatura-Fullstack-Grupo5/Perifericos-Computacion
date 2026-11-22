/**
 * Convierte un precio en el texto a mostrar, con separador de miles.
 * Ej: 239900 → "$239.900"
 * @param {number} precio
 * @returns {string}
 */
export function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-AR")}`;
}
