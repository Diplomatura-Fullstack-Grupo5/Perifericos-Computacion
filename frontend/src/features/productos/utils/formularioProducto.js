/** Valores iniciales del formulario de un producto nuevo. Todos los campos se guardan como texto. */
export const FORMULARIO_VACIO = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  image: "",
  specs: {},
};

/**
 * Arma las specs vacías de una categoría, con una clave por cada spec definida.
 * @param {Object<string, object>} [definiciones] Definiciones de specs de la categoría.
 * @returns {Object<string, string>} Ej. `{ weight_g: "", connectivity: "" }`
 */
export function armarSpecsVacias(definiciones = {}) {
  return Object.fromEntries(Object.keys(definiciones).map((clave) => [clave, ""]));
}

/**
 * Pasa un producto guardado a los valores del formulario (todo como texto; `null` queda vacío).
 * @param {object | null} producto
 * @returns {typeof FORMULARIO_VACIO}
 */
export function productoAFormulario(producto) {
  if (!producto) return FORMULARIO_VACIO;

  return {
    name: producto.name,
    description: producto.description,
    category: producto.category,
    brand: producto.brand,
    price: String(producto.price),
    stock: String(producto.stock),
    image: producto.image,
    specs: Object.fromEntries(
      Object.entries(producto.specs).map(([clave, valor]) => [
        clave,
        valor === null ? "" : String(valor),
      ]),
    ),
  };
}

/**
 * Convierte el texto de un campo de spec en el valor a guardar, según su tipo.
 * Vacío = `null` (no aplica).
 * @param {string} texto
 * @param {"number" | "boolean" | "text"} type
 * @returns {number | boolean | string | null}
 */
function convertirValorSpec(texto, type) {
  const valor = texto.trim();
  if (valor === "") return null;
  if (type === "number") return Number(valor);
  if (type === "boolean") return valor === "true";
  return valor;
}

/**
 * Pasa los valores del formulario al producto a guardar: números como números y solo las specs
 * de la categoría, en el orden de sus definiciones.
 * @param {typeof FORMULARIO_VACIO} formulario
 * @param {Object<string, {type: string}>} definiciones Definiciones de specs de la categoría elegida.
 * @returns {object}
 */
export function formularioAProducto(formulario, definiciones) {
  return {
    name: formulario.name.trim(),
    description: formulario.description.trim(),
    brand: formulario.brand,
    category: formulario.category,
    price: Number(formulario.price),
    stock: Number(formulario.stock),
    image: formulario.image.trim(),
    specs: Object.fromEntries(
      Object.entries(definiciones).map(([clave, definicion]) => [
        clave,
        convertirValorSpec(formulario.specs[clave] ?? "", definicion.type),
      ]),
    ),
  };
}
