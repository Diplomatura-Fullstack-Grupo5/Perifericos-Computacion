import { Link } from "react-router";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./TablaProductos.css";

/** Con esta cantidad de unidades o menos, el stock se resalta como bajo. */
const LIMITE_STOCK_BAJO = 5;

/**
 * Devuelve las clases del indicador de stock: rojo si no hay, amarillo si queda poco.
 * @param {number} stock
 * @returns {string}
 */
function clasesStock(stock) {
  if (stock <= 0) return "text-bg-danger";
  if (stock <= LIMITE_STOCK_BAJO) return "text-bg-warning";
  return "text-bg-light";
}

/**
 * Tabla de productos del panel, con las acciones de editar y eliminar en cada fila.
 * @param {object} props
 * @param {object[]} props.productos
 * @param {(producto: object) => void} props.onEliminar Se llama al pedir eliminar un producto.
 * @returns {JSX.Element}
 */
export function TablaProductos({ productos, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle tabla-productos-admin">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col" className="text-end">
              Precio
            </th>
            <th scope="col" className="text-end">
              Stock
            </th>
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={producto.image}
                    alt=""
                    className="tabla-productos-admin__imagen"
                    loading="lazy"
                  />
                  <div>
                    <div className="fw-semibold">{producto.name}</div>
                    <div className="small text-secondary">{producto.brand}</div>
                  </div>
                </div>
              </td>
              <td>{producto.category}</td>
              <td className="text-end text-nowrap">{formatearPrecio(producto.price)}</td>
              <td className="text-end">
                <span className={`badge ${clasesStock(producto.stock)}`}>{producto.stock}</span>
              </td>
              <td className="text-end text-nowrap">
                <Link
                  to={`/admin/productos/${producto.id}/editar`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <i className="bi bi-pencil me-1" aria-hidden="true" />
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary btn-peligro-al-pasar"
                  onClick={() => onEliminar(producto)}
                >
                  <i className="bi bi-trash me-1" aria-hidden="true" />
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
