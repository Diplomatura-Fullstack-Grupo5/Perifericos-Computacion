import { enviar, pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/** Con esta cantidad de unidades o menos, el stock de un producto se considera bajo. */
export const LIMITE_STOCK_BAJO = 5;

/**
 * Obtiene los productos del panel que coinciden con la búsqueda (por nombre o marca) y la categoría,
 * en el orden pedido. Simula `GET /api/productos?busqueda=&categoria=&orden=` (admin).
 * @param {object} [filtros]
 * @param {string} [filtros.busqueda] Texto a buscar. Vacío = sin filtro.
 * @param {string} [filtros.category] Categoría. Vacío = todas.
 * @param {"stock_asc" | "stock_desc" | ""} [filtros.sort] Orden por stock. Vacío = el orden guardado.
 * @returns {Promise<{ products: object[], total: number }>} Los que coinciden y el total sin filtrar.
 */
export async function obtenerProductos({ busqueda = "", category = "", sort = "" } = {}) {
  const data = await pedir(ENDPOINTS.productos);
  const texto = busqueda.trim().toLowerCase();

  const products = data
    .filter((product) => !category || product.category === category)
    .filter(
      (product) =>
        !texto ||
        product.name.toLowerCase().includes(texto) ||
        product.brand.toLowerCase().includes(texto),
    )
    .sort((a, b) => {
      if (sort === "stock_asc") return a.stock - b.stock;
      if (sort === "stock_desc") return b.stock - a.stock;
      return 0;
    });

  return { products, total: data.length };
}

/**
 * Obtiene un producto por su id. Simula `GET /api/productos/:id`.
 * @param {number | string} id Id del producto (puede venir como texto desde la URL).
 * @returns {Promise<object | null>} El producto, o `null` si no existe.
 */
export async function obtenerProducto(id) {
  const data = await pedir(ENDPOINTS.productos);
  return data.find((product) => product.id === Number(id)) ?? null;
}

/**
 * Obtiene las definiciones de specs de todas las categorías (etiqueta, tipo, unidad…).
 * Las claves del objeto son los nombres de las categorías, en su orden.
 * @returns {Promise<Object<string, Object<string, object>>>}
 *   Ej. `{ Mouses: { weight_g: { label: "Peso", type: "number", unit: "g" } } }`
 */
export async function obtenerDefinicionesSpecs() {
  return pedir(ENDPOINTS.categorias);
}

/**
 * Obtiene las marcas de cada categoría. Simula `GET /api/marcas`.
 * @returns {Promise<Object<string, string[]>>} Ej. `{ Mouses: ["Logitech", "Razer"] }`
 */
export async function obtenerMarcas() {
  return pedir(ENDPOINTS.marcas);
}

/**
 * Obtiene, por categoría y spec, los valores de texto que ya usan los productos, para sugerirlos
 * al cargar uno nuevo (así los filtros del catálogo no quedan con "Inalámbrico" e "inalambrico").
 * @returns {Promise<Object<string, Object<string, string[]>>>}
 *   Ej. `{ Mouses: { connectivity: ["Cableado", "Inalámbrico"] } }`
 */
export async function obtenerValoresSpecs() {
  const data = await pedir(ENDPOINTS.productos);
  const valores = {};

  data.forEach(({ category, specs }) => {
    const deLaCategoria = valores[category] ?? {};
    Object.entries(specs).forEach(([clave, valor]) => {
      const lista = deLaCategoria[clave] ?? [];
      if (typeof valor === "string" && !lista.includes(valor)) {
        deLaCategoria[clave] = [...lista, valor].sort((a, b) => a.localeCompare(b, "es"));
      }
    });
    valores[category] = deLaCategoria;
  });

  return valores;
}

/**
 * Comprueba las reglas de un producto antes de guardarlo, como lo hará el backend: campos
 * obligatorios, precio y stock válidos, marca de la categoría y specs de la categoría con el tipo
 * que corresponde.
 * @param {object} producto
 * @throws {Error} Con un mensaje para el usuario si algo no es válido.
 */
async function validarProducto(producto) {
  const [definiciones, marcas] = await Promise.all([
    obtenerDefinicionesSpecs(),
    obtenerMarcas(),
  ]);
  const definicionesCategoria = definiciones[producto.category];

  if (!producto.name || !producto.description || !producto.image) {
    throw new Error("Completá el nombre, la descripción y la imagen.");
  }
  if (!definicionesCategoria) throw new Error("La categoría no existe.");
  if (!marcas[producto.category]?.includes(producto.brand)) {
    throw new Error(`La marca no corresponde a la categoría ${producto.category}.`);
  }
  if (!Number.isInteger(producto.price) || producto.price <= 0) {
    throw new Error("El precio tiene que ser un número entero mayor a 0.");
  }
  if (!Number.isInteger(producto.stock) || producto.stock < 0) {
    throw new Error("El stock tiene que ser un número entero, 0 o más.");
  }

  const claves = Object.keys(producto.specs ?? {});
  const clavesCategoria = Object.keys(definicionesCategoria);
  const mismasClaves =
    claves.length === clavesCategoria.length &&
    clavesCategoria.every((clave) => claves.includes(clave));
  if (!mismasClaves) {
    throw new Error("Las especificaciones no coinciden con las de la categoría.");
  }

  const tipos = { number: "number", boolean: "boolean", text: "string" };
  const specInvalida = clavesCategoria.find((clave) => {
    const valor = producto.specs[clave];
    return valor !== null && typeof valor !== tipos[definicionesCategoria[clave].type];
  });
  if (specInvalida) {
    throw new Error(`El valor de "${definicionesCategoria[specInvalida].label}" no es válido.`);
  }
}

/**
 * Crea un producto. Simula `POST /api/productos`. Un producto nuevo empieza sin ventas.
 * @param {object} producto Datos del producto, sin `id` (lo asigna el servidor).
 * @returns {Promise<object>} El producto creado, con su `id`.
 * @throws {Error} Si los datos no son válidos o el servidor responde con error.
 */
export async function crearProducto(producto) {
  await validarProducto(producto);
  return enviar(ENDPOINTS.crearProducto, { ...producto, sold: 0 });
}

/**
 * Modifica un producto. Simula `PUT /api/productos/:id`. Las ventas (`sold`) no se modifican.
 * @param {number} id
 * @param {object} producto Datos nuevos del producto.
 * @returns {Promise<object>} El producto modificado.
 * @throws {Error} Si los datos no son válidos o el servidor responde con error.
 */
export async function actualizarProducto(id, producto) {
  await validarProducto(producto);
  return enviar(ENDPOINTS.producto(id), producto, "PUT");
}

/**
 * Elimina un producto. Simula `DELETE /api/productos/:id`.
 * @param {number} id
 * @returns {Promise<void>}
 * @throws {Error} Si el servidor responde con error.
 */
export async function eliminarProducto(id) {
  await enviar(ENDPOINTS.producto(id), undefined, "DELETE");
}
