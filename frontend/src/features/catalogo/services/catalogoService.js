import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

export const OPCIONES_ORDEN = [
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "name_desc", label: "Nombre (Z-A)" },
];

/**
 * Indica si un valor está dentro del rango. Un límite en null no restringe.
 * Si el valor es null (ej. batería de un auricular con cable), solo pasa cuando no hay límites.
 * @param {number | null} value
 * @param {{ min?: number | null, max?: number | null }} [range]
 * @returns {boolean}
 */
function isInRange(value, { min = null, max = null } = {}) {
  if (value === null || value === undefined) return min === null && max === null;
  return (min === null || value >= min) && (max === null || value <= max);
}

/**
 * Obtiene los productos filtrados y ordenados.
 * @param {object} [filters]
 * @param {string} [filters.category] Categoría (ej. "Mouses").
 * @param {string} [filters.sort] Uno de los `value` de OPCIONES_ORDEN.
 * @param {string[]} [filters.brands] Marcas elegidas. Vacío = todas.
 * @param {Object<string, Array>} [filters.specs] Valores elegidos por spec, ej. `{ connectivity: ["Inalámbrico"] }`.
 * @param {Object<string, {min: number|null, max: number|null}>} [filters.ranges] Rangos por spec, ej. `{ weight_g: { min: null, max: 80 } }`.
 * @param {{min: number|null, max: number|null}} [filters.price] Rango de precio.
 * @returns {Promise<object[]>}
 */
export async function obtenerProductos({
  category,
  sort,
  brands,
  specs = {},
  ranges = {},
  price,
} = {}) {
  const data = await pedir(ENDPOINTS.productos);

  return data
    .filter((product) => !category || product.category === category)
    .filter((product) => !brands?.length || brands.includes(product.brand))
    .filter((product) =>
      Object.entries(specs).every(
        ([key, values]) => !values.length || values.includes(product.specs[key]),
      ),
    )
    .filter((product) =>
      Object.entries(ranges).every(([key, range]) =>
        isInRange(product.specs[key], range),
      ),
    )
    .filter((product) => isInRange(product.price, price))
    .sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
}

//! Agregar un brand en productos, implica agregarlo aca tambien. Replantear en backend
/**
 * Obtiene las marcas que tienen productos en la categoría.
 * @param {object} [params]
 * @param {string} [params.category] Categoría (ej. "Mouses").
 * @returns {Promise<string[]>}
 */
export async function obtenerMarcas({ category } = {}) {
  const data = await pedir(ENDPOINTS.marcas);
  return data[category] ?? [];
}

/**
 * Obtiene las definiciones de specs de todas las categorías (etiqueta, unidad, featured, rule, filter).
 * @returns {Promise<Object<string, object>>} Ej. `{ Mouses: { weight_g: { label: "Peso", unit: "g", ... } } }`
 */
export async function obtenerDefinicionesSpecs() {
  return pedir(ENDPOINTS.categorias);
}

/**
 * Obtiene, para cada spec de la categoría, los valores distintos que existen en sus productos.
 * Simula `GET /api/categorias/:categoria/filtros`.
 * @param {object} [params]
 * @param {string} [params.category] Categoría (ej. "Mouses").
 * @returns {Promise<Object<string, Array>>} Ej. `{ connectivity: ["Cableado", "Inalámbrico"] }`
 */
export async function obtenerOpcionesSpecs({ category } = {}) {
  const data = await pedir(ENDPOINTS.productos);
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
