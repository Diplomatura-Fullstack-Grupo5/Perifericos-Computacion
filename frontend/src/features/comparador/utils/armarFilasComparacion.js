/**
 * Índices de los productos con el mejor valor de una fila, según su regla.
 * No hay ganador si la fila no tiene regla, si todos los valores son iguales o si hay un solo producto.
 * En empate, todos los empatados son "mejores". Los valores no numéricos (o `null`) no compiten.
 * @param {{ rule?: "higher" | "lower", valores: Array }} fila
 * @param {boolean} difieren
 * @returns {number[]}
 */
function calcularMejores({ rule, valores }, difieren) {
  if (!rule || !difieren || valores.length < 2) return [];

  const numeros = valores.filter((valor) => typeof valor === "number");
  if (numeros.length === 0) return [];

  const mejor = rule === "higher" ? Math.max(...numeros) : Math.min(...numeros);
  return valores.flatMap((valor, i) => (valor === mejor ? [i] : []));
}

/**
 * Arma las filas de la tabla del comparador: primero el precio y después una fila por cada spec
 * de la categoría, en el orden de sus definiciones.
 * @param {object[]} productos Productos a comparar (todos de la misma categoría).
 * @param {Object<string, {label: string, unit?: string, rule?: string}>} [definiciones]
 * @returns {{ key: string, label: string, unit?: string, rule?: string, valores: Array,
 *   difieren: boolean, mejores: number[] }[]}
 *   `difieren`: hay al menos un valor distinto. `mejores`: índices de los productos con el mejor valor.
 */
export function armarFilasComparacion(productos, definiciones = {}) {
  const filas = [
    {
      key: "price",
      label: "Precio",
      rule: "lower",
      valores: productos.map((producto) => producto.price),
    },
    ...Object.entries(definiciones).map(([key, definicion]) => ({
      key,
      label: definicion.label,
      unit: definicion.unit,
      rule: definicion.rule,
      valores: productos.map((producto) => producto.specs?.[key] ?? null),
    })),
  ];

  return filas.map((fila) => {
    const difieren = new Set(fila.valores).size > 1;
    return { ...fila, difieren, mejores: calcularMejores(fila, difieren) };
  });
}
