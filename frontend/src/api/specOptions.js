/**
 * Obtiene, para cada spec de la categoría, los valores distintos que existen en sus productos.
 * Simula `GET /api/categorias/:categoria/filtros`.
 * @param {object} [params]
 * @param {string} [params.category] Categoría (ej. "Mouses").
 * @returns {Promise<Object<string, Array>>} Ej. `{ connectivity: ["Cableado", "Inalámbrico"] }`
 */
export async function getSpecOptions({ category } = {}) {
  const response = await fetch("/data/products.json");

  if (!response.ok) {
    throw new Error("Error al obtener las opciones de filtro");
  }

  const data = await response.json();
  const options = {};

  data
    .filter((product) => product.category === category)
    .forEach((product) => {
      Object.entries(product.specs).forEach(([key, value]) => {
        if (value === null) return;
        options[key] ??= [];
        if (!options[key].includes(value)) options[key].push(value);
      });
    });

  Object.values(options).forEach((values) =>
    values.sort((a, b) => {
      if (typeof a === "number") return a - b;
      if (typeof a === "boolean") return b - a;
      return String(a).localeCompare(String(b), "es", { numeric: true });
    }),
  );

  return options;
}
