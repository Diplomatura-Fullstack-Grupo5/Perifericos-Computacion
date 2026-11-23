import { Link } from "react-router";
import "./CategoriasDestacadas.css";

const ICONOS = {
  Mouses: "bi-mouse",
  Teclados: "bi-keyboard",
  Auriculares: "bi-headphones",
  Monitores: "bi-display",
};

/**
 * Accesos al catálogo filtrado por cada categoría.
 * @param {object} props
 * @param {string[]} props.categorias Nombres de las categorías.
 */
export function CategoriasDestacadas({ categorias }) {
  return (
    <section className="container py-5">
      <h2 className="fs-3 fw-bold mb-4">Explorá por categoría</h2>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
        {categorias.map((categoria) => (
          <div key={categoria} className="col">
            <Link
              to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
              className="categoria-destacada card h-100 text-decoration-none text-body"
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3 py-4 py-sm-5">
                <i
                  className={`bi ${ICONOS[categoria] ?? "bi-box"} text-primary categoria-destacada-icono`}
                  aria-hidden="true"
                />
                <span className="fs-5 fw-semibold">{categoria}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
