import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/**
 * Datos principales del producto: marca, nombre, descripción, precio y stock.
 * @param {object} props
 * @param {string} props.brand
 * @param {string} props.name
 * @param {string} [props.description]
 * @param {number} props.price
 * @param {number} props.stock Unidades disponibles.
 * @returns {JSX.Element}
 */
export function InfoProducto({ brand, name, description, price, stock }) {
  const hayStock = stock > 0;

  return (
    <div className="mb-3">
      <p className="text-secondary small mb-1">{brand}</p>
      <h1 className="fs-3 fw-bold mb-2">{name}</h1>
      {description && <p className="text-secondary mb-3">{description}</p>}

      <p className="fs-2 fw-bold text-primary mb-2">{formatearPrecio(price)}</p>

      <span
        className={`badge fw-normal ${
          hayStock
            ? "bg-success-subtle text-success-emphasis"
            : "bg-secondary-subtle text-secondary-emphasis"
        }`}
      >
        {hayStock ? `En stock · ${stock} u.` : "Sin stock"}
      </span>
    </div>
  );
}
