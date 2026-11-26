import { Link } from "react-router";
import "./ListaProductosDashboard.css";

/**
 * Alertas de stock bajo: cada producto con las unidades que quedan (en rojo si no hay) y un enlace
 * para editarlo.
 * @param {object} props
 * @param {object[]} props.productos Ordenados de menos a más stock.
 * @returns {JSX.Element}
 */
export function ListaStockBajo({ productos }) {
  return (
    <ul className="list-group list-group-flush">
      {productos.map((producto) => (
        <li key={producto.id} className="list-group-item d-flex align-items-center gap-3">
          <img src={producto.image} alt="" className="lista-productos-dashboard__imagen" />
          <div className="flex-grow-1 lista-productos-dashboard__texto">
            <Link to={`/admin/productos/${producto.id}/editar`} className="d-block text-truncate link-body-emphasis link-underline-opacity-0 link-underline-opacity-100-hover">
              {producto.name}
            </Link>
            <span className="small text-secondary">{producto.category}</span>
          </div>
          <span
            className={`badge text-nowrap ${producto.stock <= 0 ? "text-bg-danger" : "text-bg-warning"}`}
          >
            {producto.stock <= 0 ? "Sin stock" : `${producto.stock} u.`}
          </span>
        </li>
      ))}
    </ul>
  );
}
