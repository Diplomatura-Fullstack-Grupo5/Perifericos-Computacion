import { useState } from "react";
import { CarritoContext } from "../hooks/carritoContext";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";

const CLAVE_LOCAL_STORAGE = "puntotech-carrito";

/**
 * Comprueba que lo guardado en localStorage sea una lista de productos del carrito válida.
 * @param {*} valor
 * @returns {boolean}
 */
function esCarritoValido(valor) {
  return (
    Array.isArray(valor) &&
    valor.every(
      (item) =>
        Number.isInteger(item?.id) &&
        typeof item?.name === "string" &&
        typeof item?.price === "number" &&
        Number.isInteger(item?.stock) &&
        Number.isInteger(item?.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= item.stock,
    )
  );
}

/**
 * Limita una cantidad entre 1 y el stock disponible.
 * @param {number} cantidad
 * @param {number} stock
 * @returns {number}
 */
function limitarCantidad(cantidad, stock) {
  return Math.min(Math.max(cantidad, 1), stock);
}

/**
 * Guarda los productos del carrito (con una copia de su nombre, precio, imagen y stock) y los
 * comparte con toda la aplicación. El carrito se conserva en localStorage; el panel lateral
 * empieza cerrado en cada visita.
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function CarritoProvider({ children }) {
  const [items, setItems] = useLocalStorage(CLAVE_LOCAL_STORAGE, [], esCarritoValido);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const cantidad = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  /**
   * Suma una unidad del producto (o lo agrega si no estaba) y abre el panel.
   * Si ya estaba, actualiza su copia de datos con los recibidos. Sin stock, no hace nada.
   * @param {{id: number, name: string, price: number, image?: string, stock: number}} producto
   */
  function agregar({ id, name, price, image, stock }) {
    if (stock <= 0) return;

    setItems((prev) => {
      const existente = prev.find((item) => item.id === id);
      if (!existente) return [...prev, { id, name, price, image, stock, quantity: 1 }];

      return prev.map((item) =>
        item.id === id
          ? { id, name, price, image, stock, quantity: limitarCantidad(item.quantity + 1, stock) }
          : item,
      );
    });
    setPanelAbierto(true);
  }

  function cambiarCantidad(id, cantidadNueva) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: limitarCantidad(cantidadNueva, item.stock) }
          : item,
      ),
    );
  }

  /**
   * Actualiza la copia de datos del carrito con los productos actuales (ej. al confirmar el pedido):
   * nombre, precio, imagen y stock. Baja las cantidades que superan el stock y quita los productos
   * que ya no existen o no tienen stock.
   * @param {{id: number, name: string, price: number, image?: string, stock: number}[]} productosActuales
   */
  function actualizarProductos(productosActuales) {
    setItems((prev) =>
      prev.flatMap((item) => {
        const actual = productosActuales.find((producto) => producto.id === item.id);
        if (!actual || actual.stock <= 0) return [];
        const { name, price, image, stock } = actual;
        return [{ ...item, name, price, image, stock, quantity: Math.min(item.quantity, stock) }];
      }),
    );
  }

  function quitar(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function vaciar() {
    setItems([]);
  }

  const valor = {
    items,
    cantidad,
    subtotal,
    agregar,
    cambiarCantidad,
    actualizarProductos,
    quitar,
    vaciar,
    panelAbierto,
    abrirPanel: () => setPanelAbierto(true),
    cerrarPanel: () => setPanelAbierto(false),
  };

  return <CarritoContext value={valor}>{children}</CarritoContext>;
}
