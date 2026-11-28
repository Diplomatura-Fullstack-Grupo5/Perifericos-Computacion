/** Cantidad mínima de letras para empezar a sugerir productos. */
export const MINIMO_LETRAS_BUSQUEDA = 3;

/** Cantidad máxima de sugerencias. */
export const LIMITE_SUGERENCIAS = 6;

/**
 * Pasa un texto a minúsculas y le saca las tildes y la diéresis, para comparar sin que importen
 * (ej. "Áuriculares Güemes" → "auriculares guemes"). La ñ se conserva.
 * @param {string} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/([aeiou])[́̈]/g, "$1")
    .normalize("NFC");
}

/**
 * Elige los productos que coinciden con lo que se escribió en el buscador. Cada palabra tiene que
 * aparecer en el nombre, la marca o la categoría, sin importar mayúsculas ni tildes (así "teclado
 * logitech" encuentra los teclados Logitech). Primero van los productos cuyo nombre empieza con lo
 * buscado y, después, los más vendidos.
 * @param {object[]} productos Lista completa de productos.
 * @param {string} busqueda Texto escrito por el usuario.
 * @param {number} [limite] Cantidad máxima de resultados.
 * @returns {{ id: number, name: string, brand: string, price: number, image?: string }[]} Vacío si
 *   la búsqueda tiene menos de `MINIMO_LETRAS_BUSQUEDA` letras.
 */
export function buscarSugerencias(productos, busqueda, limite = LIMITE_SUGERENCIAS) {
  const texto = normalizarTexto(busqueda.trim());
  if (texto.length < MINIMO_LETRAS_BUSQUEDA) return [];

  const palabras = texto.split(/\s+/);

  return productos
    .map((producto) => ({ producto, nombre: normalizarTexto(producto.name) }))
    .filter(({ producto, nombre }) => {
      const donde = `${nombre} ${normalizarTexto(producto.brand)} ${normalizarTexto(producto.category)}`;
      return palabras.every((palabra) => donde.includes(palabra));
    })
    .sort((a, b) => {
      const empiezaA = a.nombre.startsWith(texto) ? 0 : 1;
      const empiezaB = b.nombre.startsWith(texto) ? 0 : 1;
      return empiezaA - empiezaB || (b.producto.sold ?? 0) - (a.producto.sold ?? 0);
    })
    .slice(0, limite)
    .map(({ producto: { id, name, brand, price, image } }) => ({ id, name, brand, price, image }));
}
