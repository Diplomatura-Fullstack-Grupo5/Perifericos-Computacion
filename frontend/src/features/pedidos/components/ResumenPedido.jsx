import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./ResumenPedido.css";

/**
 * Resumen de los productos que se van a comprar, con el total. Solo muestra: las cantidades se
 * cambian en el panel del carrito.
 * @param {object} props
 * @param {{id: number, name: string, price: number, image?: string, quantity: number}[]} props.items
 * @param {number} props.total
 * @param {() => void} [props.onEditar] Abre el carrito para cambiar productos o cantidades.
 * @returns {JSX.Element}
 */
export function ResumenPedido({ items, total, onEditar }) {
  return (
    <section className="card resumen-pedido" aria-labelledby="resumen-pedido-titulo">
      <div className="card-header bg-body d-flex justify-content-between align-items-center">
        <h2 id="resumen-pedido-titulo" className="fs-6 fw-bold mb-0">
          Resumen del pedido
        </h2>
        {onEditar && (
          <button type="button" className="btn btn-sm btn-link px-0" onClick={onEditar}>
            Editar carrito
          </button>
        )}
      </div>

      <ul className="list-group list-group-flush">
        {items.map(({ id, name, price, image, quantity }) => (
          <li key={id} className="list-group-item d-flex gap-3 align-items-center">
            <div className="resumen-pedido-miniatura">
              {image ? (
                <img src={image} alt="" />
              ) : (
                <i className="bi bi-image text-secondary" aria-hidden="true" />
              )}
            </div>
            <div className="flex-grow-1">
              <p className="small fw-semibold mb-0">{name}</p>
              <p className="small text-secondary mb-0">
                {quantity} × {formatearPrecio(price)}
              </p>
            </div>
            <span className="fw-semibold text-nowrap">{formatearPrecio(price * quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="card-footer bg-body d-flex justify-content-between align-items-baseline">
        <span className="fw-semibold">Total</span>
        <span className="fs-4 fw-bold text-primary">{formatearPrecio(total)}</span>
      </div>
    </section>
  );
}
