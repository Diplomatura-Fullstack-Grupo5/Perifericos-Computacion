import { useState } from "react";
import { Link } from "react-router";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/**
 * Un producto dentro del panel del carrito: miniatura, nombre, precio, cantidad y botón para quitarlo.
 * @param {object} props
 * @param {import("../hooks/useCarrito").ItemCarrito} props.item
 * @param {(id: number, cantidad: number) => void} props.onCambiarCantidad
 * @param {(id: number) => void} props.onQuitar
 * @param {() => void} props.onIrAProducto Se llama al tocar el nombre (para cerrar el panel).
 * @returns {JSX.Element}
 */
export function ItemPanelCarrito({ item, onCambiarCantidad, onQuitar, onIrAProducto }) {
  const { id, name, price, image, stock, quantity } = item;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="panel-carrito-item">
      <div className="panel-carrito-miniatura">
        {image && !imageFailed ? (
          <img src={image} alt="" onError={() => setImageFailed(true)} />
        ) : (
          <i className="bi bi-image text-secondary" aria-hidden="true" />
        )}
      </div>

      <div className="flex-grow-1">
        <Link to={`/producto/${id}`} className="panel-carrito-nombre" onClick={onIrAProducto}>
          {name}
        </Link>
        <p className="fw-semibold text-primary mb-2">{formatearPrecio(price)}</p>

        <div className="d-flex align-items-center justify-content-between">
          <div className="input-group input-group-sm panel-carrito-cantidad">
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label={`Restar una unidad de ${name}`}
              disabled={quantity <= 1}
              onClick={() => onCambiarCantidad(id, quantity - 1)}
            >
              <i className="bi bi-dash" aria-hidden="true" />
            </button>
            <span className="input-group-text bg-body" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label={`Sumar una unidad de ${name}`}
              disabled={quantity >= stock}
              onClick={() => onCambiarCantidad(id, quantity + 1)}
            >
              <i className="bi bi-plus" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-link panel-carrito-quitar"
            aria-label={`Quitar ${name} del carrito`}
            title="Quitar del carrito"
            onClick={() => onQuitar(id)}
          >
            <i className="bi bi-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
