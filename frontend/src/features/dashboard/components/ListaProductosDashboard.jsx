import { Link } from "react-router";
import "./ListaProductosDashboard.css";

/**
 * Lista de productos del dashboard (más vendidos, más comparados, stock bajo): miniatura, nombre
 * con enlace, categoría y, a la derecha, el dato que corresponde a cada lista.
 * @param {object} props
 * @param {{ id: number, name: string, image?: string, category: string }[]} props.productos
 * @param {(producto: object) => string} props.enlace Ruta a la que lleva el nombre del producto.
 * @param {(producto: object) => import("react").ReactNode} props.dato Lo que se muestra a la derecha.
 * @param {boolean} [props.numerada] `true` para un ranking (lista ordenada).
 * @returns {JSX.Element}
 */
export function ListaProductosDashboard({ productos, enlace, dato, numerada = false }) {
  const Lista = numerada ? "ol" : "ul";

  return (
    <Lista className="list-group list-group-flush">
      {productos.map((producto) => (
        <li key={producto.id} className="list-group-item d-flex align-items-center gap-3">
          {producto.image ? (
            <img src={producto.image} alt="" className="lista-productos-dashboard__imagen" />
          ) : (
            <span className="lista-productos-dashboard__imagen" aria-hidden="true" />
          )}
          <div className="flex-grow-1 lista-productos-dashboard__texto">
            <Link
              to={enlace(producto)}
              className="d-block text-truncate link-body-emphasis link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {producto.name}
            </Link>
            <span className="small text-secondary">{producto.category}</span>
          </div>
          <span className="text-nowrap small text-end">{dato(producto)}</span>
        </li>
      ))}
    </Lista>
  );
}
