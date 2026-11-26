import { Link } from "react-router";

/**
 * Migas de pan de la ficha: Inicio › Categoría › Producto.
 * @param {object} props
 * @param {string} props.category Categoría del producto; enlaza al catálogo filtrado.
 * @param {string} props.name Nombre del producto (página actual, sin link).
 * @returns {JSX.Element}
 */
export function MigasProducto({ category, name }) {
  return (
    <nav aria-label="Ubicación" className="small mb-3">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/">Inicio</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/catalogo?categoria=${encodeURIComponent(category)}`}>{category}</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {name}
        </li>
      </ol>
    </nav>
  );
}
