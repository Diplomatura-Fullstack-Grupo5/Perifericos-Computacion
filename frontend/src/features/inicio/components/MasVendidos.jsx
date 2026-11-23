import { Link } from "react-router";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./MasVendidos.css";

/**
 * Productos más vendidos en un mosaico: el primero ocupa más espacio y el resto se acomoda
 * alrededor, manteniendo el orden del ranking de izquierda a derecha.
 * @param {object} props
 * @param {object[]} props.productos Productos ordenados de más a menos vendido.
 */
export function MasVendidos({ productos }) {
  return (
    <section className="container pb-5">
      <div className="d-flex justify-content-between align-items-baseline mb-4">
        <h2 className="fs-3 fw-bold mb-0">Más vendidos</h2>
        <Link to="/catalogo" className="fw-semibold">
          Ver todo el catálogo
        </Link>
      </div>

      <ol className="mas-vendidos list-unstyled mb-0">
        {productos.map((producto, i) => (
          <li key={producto.id} className="mas-vendidos-item">
            <Link
              to={`/producto/${producto.id}`}
              className="mas-vendidos-enlace text-decoration-none text-body"
            >
              <span className="mas-vendidos-ranking">#{i + 1}</span>
              <img
                src={producto.image}
                alt=""
                loading="lazy"
                className="mas-vendidos-imagen"
              />
              <div className="mas-vendidos-info">
                <div className="text-truncate">
                  <h3 className="mas-vendidos-nombre text-truncate mb-0">
                    {producto.name}
                  </h3>
                  <span className="mas-vendidos-precio">
                    {formatearPrecio(producto.price)}
                  </span>
                </div>
                <span className="mas-vendidos-flecha" aria-hidden="true">
                  <i className="bi bi-arrow-right" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
