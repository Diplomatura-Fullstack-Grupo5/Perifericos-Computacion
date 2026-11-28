import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";
import { esRangoInvalido } from "../utils/esRangoInvalido";

export const OPCIONES_ORDEN = [
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "name_desc", label: "Nombre (Z-A)" },
];

export const PRODUCTOS_POR_PAGINA = 12;

/**
 * Indica si un valor está dentro del rango. Un límite en null no restringe.
 * Si el valor es null (ej. batería de un auricular con cable), solo pasa cuando no hay límites.
 * Un rango inválido (mínimo mayor que el máximo) no se aplica: el usuario lo está corrigiendo y
 * se le avisa junto al filtro, así que se siguen mostrando los productos en lugar de 0 resultados.
 * @param {number | null} value
 * @param {{ min?: number | null, max?: number | null }} [range]
 * @returns {boolean}
 */
function isInRange(value, { min = null, max = null } = {}) {
  if (esRangoInvalido({ min, max })) return true;
  if (value === null || value === undefined) return min === null && max === null;
  return (min === null || value >= min) && (max === null || value <= max);
}

/**
 * Obtiene una página de productos filtrados y ordenados, y el total de productos que cumplen los filtros.
 * @param {object} [filters]
 * @param {string} [filters.category] Categoría (ej. "Mouses").
 * @param {string} [filters.sort] Uno de los `value` de OPCIONES_ORDEN.
 * @param {string[]} [filters.brands] Marcas elegidas. Vacío = todas.
 * @param {Object<string, Array>} [filters.specs] Valores elegidos por spec, ej. `{ connectivity: ["Inalámbrico"] }`.
 * @param {Object<string, {min: number|null, max: number|null}>} [filters.ranges] Rangos por spec, ej. `{ weight_g: { min: null, max: 80 } }`.
 * @param {{min: number|null, max: number|null}} [filters.price] Rango de precio.
 * @param {number} [filters.page] Número de página, empezando en 1.
 * @returns {Promise<{ products: object[], total: number }>}
 */
export async function obtenerProductos({
  category,
  sort,
  brands,
  specs = {},
  ranges = {},
  price,
  page = 1,
} = {}) {
  const data = await pedir(ENDPOINTS.productos);

  const filtrados = data
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

  const inicio = (page - 1) * PRODUCTOS_POR_PAGINA;
  return {
    products: filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA),
    total: filtrados.length,
  };
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
 * Obtiene los nombres de las categorías, en el orden de categorias.json.
 * Simula `GET /api/categorias`.
 * @returns {Promise<string[]>}
 */
export async function obtenerCategorias() {
  const data = await pedir(ENDPOINTS.categorias);
  return Object.keys(data);
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
