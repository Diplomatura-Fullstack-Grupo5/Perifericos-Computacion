/**
 * Indica si un rango tiene el mínimo mayor que el máximo (ej. peso de 100 a 50 g).
 * La usan el filtro, para avisar del error junto a los campos, y el service, para no aplicar ese
 * rango. Cuando el filtrado pase al backend, el filtro la va a seguir necesitando para el aviso.
 * @param {{ min?: number | null, max?: number | null }} [range]
 * @returns {boolean}
 */
export function esRangoInvalido({ min = null, max = null } = {}) {
  return min !== null && max !== null && min > max;
}
