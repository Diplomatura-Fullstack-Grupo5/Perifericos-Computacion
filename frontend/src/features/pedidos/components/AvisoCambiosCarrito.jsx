import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/**
 * Arma el texto de un cambio, sin mostrar cuánto stock queda.
 * @param {import("../services/pedidosService").CambioCarrito} cambio
 * @returns {string}
 */
function describirCambio({ tipo, name, price }) {
  switch (tipo) {
    case "precio":
      return `Cambió el precio de ${name}: ahora es ${formatearPrecio(price)}.`;
    case "stock":
      return `Ya no hay stock suficiente de ${name}: ajustamos la cantidad.`;
    case "sinStock":
      return `${name} se quedó sin stock: lo quitamos del carrito.`;
    default:
      return `${name} ya no está disponible: lo quitamos del carrito.`;
  }
}

/**
 * Avisa qué cambió en el carrito al intentar confirmar el pedido (precios, stock o productos que ya
 * no existen). El pedido no se guardó: el cliente revisa y vuelve a confirmar.
 * @param {object} props
 * @param {import("../services/pedidosService").CambioCarrito[]} props.cambios
 * @returns {JSX.Element | null}
 */
export function AvisoCambiosCarrito({ cambios }) {
  if (cambios.length === 0) return null;

  return (
    <div className="alert alert-warning" role="alert">
      <p className="fw-semibold mb-2">
        <i className="bi bi-exclamation-triangle me-2" aria-hidden="true" />
        Hubo cambios en tu carrito. Revisalos y volvé a confirmar el pedido.
      </p>
      <ul className="mb-0">
        {cambios.map((cambio) => (
          <li key={`${cambio.tipo}-${cambio.name}`}>{describirCambio(cambio)}</li>
        ))}
      </ul>
    </div>
  );
}
