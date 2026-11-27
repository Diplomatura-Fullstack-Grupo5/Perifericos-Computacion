import { useContext } from "react";
import { CarritoContext } from "./carritoContext";

/**
 * @typedef {object} ItemCarrito
 * @property {number} id
 * @property {string} name
 * @property {number} price Precio al momento de agregarlo.
 * @property {string} [image]
 * @property {number} stock Unidades disponibles al agregarlo: tope de `quantity`.
 * @property {number} quantity Unidades elegidas.
 */

/**
 * Da acceso a los productos del carrito, a sus acciones y al panel lateral.
 * @returns {{
 *   items: ItemCarrito[],
 *   cantidad: number,
 *   subtotal: number,
 *   agregar: (producto: {id: number, name: string, price: number, image?: string, stock: number}) => void,
 *   cambiarCantidad: (id: number, cantidad: number) => void,
 *   actualizarProductos: (productosActuales: {id: number, name: string, price: number, image?: string, stock: number}[]) => void,
 *   quitar: (id: number) => void,
 *   vaciar: () => void,
 *   panelAbierto: boolean,
 *   abrirPanel: () => void,
 *   cerrarPanel: () => void,
 * }}
 * @throws {Error} Si se usa fuera de `<CarritoProvider>`.
 */
export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return contexto;
}
