import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/** Con esta cantidad de unidades o menos, se muestra "¡Últimas unidades!". */
const LIMITE_ULTIMAS_UNIDADES = 5;

/**
 * Devuelve el texto y los colores de la etiqueta de stock, sin mostrar la cantidad exacta.
 * @param {number} stock Unidades disponibles.
 * @returns {{ texto: string, clases: string }}
 */
function obtenerEtiquetaStock(stock) {
  if (stock <= 0) {
    return { texto: "Sin stock", clases: "bg-secondary-subtle text-secondary-emphasis" };
  }
  if (stock <= LIMITE_ULTIMAS_UNIDADES) {
    return { texto: "¡Últimas unidades!", clases: "bg-warning-subtle text-warning-emphasis" };
  }
  return { texto: "En stock", clases: "bg-success-subtle text-success-emphasis" };
}

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
  const etiquetaStock = obtenerEtiquetaStock(stock);

  return (
    <div className="mb-3">
      <p className="text-secondary small mb-1">{brand}</p>
      <h1 className="fs-3 fw-bold mb-2">{name}</h1>
      {description && <p className="text-secondary mb-3">{description}</p>}

      <p className="fs-2 fw-bold text-primary mb-2">{formatearPrecio(price)}</p>

      <span className={`badge fw-normal ${etiquetaStock.clases}`}>{etiquetaStock.texto}</span>
    </div>
  );
}
