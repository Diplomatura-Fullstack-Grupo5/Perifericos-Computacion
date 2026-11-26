import { Link } from "react-router";
import "./ListaProductosDashboard.css";

/**
 * Ranking de los productos más comparados, con la cantidad de veces que se agregaron al comparador.
 * @param {object} props
 * @param {object[]} props.productos Ordenados de más a menos comparado.
 * @returns {JSX.Element}
 */
export function ListaMasComparados({ productos }) {
  return (
    <ol className="list-group list-group-flush">
      {productos.map((producto) => (
        <li key={producto.id} className="list-group-item d-flex align-items-center gap-3">
          <img src={producto.image} alt="" className="lista-productos-dashboard__imagen" />
          <div className="flex-grow-1 lista-productos-dashboard__texto">
            <Link to={`/producto/${producto.id}`} className="d-block text-truncate link-body-emphasis link-underline-opacity-0 link-underline-opacity-100-hover">
              {producto.name}
            </Link>
            <span className="small text-secondary">{producto.category}</span>
          </div>
          <span className="text-nowrap small">
            <strong>{producto.compared}</strong> comparaciones
          </span>
        </li>
      ))}
    </ol>
  );
}
