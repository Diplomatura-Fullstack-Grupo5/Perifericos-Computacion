import { Link } from "react-router";
import "./FilaProductoDashboard.css";

/**
 * Fila de una lista de productos del dashboard (más vendidos y stock bajo): miniatura, nombre con
 * enlace, categoría y, a la derecha, el dato de esa lista.
 * @param {object} props
 * @param {{ name: string, image?: string, category: string }} props.producto
 * @param {string} props.enlace Ruta a la que lleva el nombre del producto.
 * @param {import("react").ReactNode} props.children Dato que se muestra a la derecha.
 * @returns {JSX.Element}
 */
export function FilaProductoDashboard({ producto, enlace, children }) {
  return (
    <li className="list-group-item d-flex align-items-center gap-3">
      {producto.image ? (
        <img src={producto.image} alt="" className="fila-producto-dashboard-imagen" />
      ) : (
        <span className="fila-producto-dashboard-imagen" aria-hidden="true" />
      )}
      <div className="flex-grow-1 fila-producto-dashboard-texto">
        <Link
          to={enlace}
          className="d-block text-truncate link-body-emphasis link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          {producto.name}
        </Link>
        <span className="small text-secondary">{producto.category}</span>
      </div>
      <span className="text-nowrap small text-end">{children}</span>
    </li>
  );
}
