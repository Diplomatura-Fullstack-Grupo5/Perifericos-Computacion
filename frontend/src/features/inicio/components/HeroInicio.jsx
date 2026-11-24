import { Link } from "react-router";
import { VistaPreviaComparador } from "./VistaPreviaComparador";
import "./HeroInicio.css";

/**
 * Presentación principal de la página de inicio: mensaje, accesos al catálogo y al comparador,
 * y una vista previa de cómo se compara.
 */
export function HeroInicio() {
  return (
    <section className="hero-inicio py-5">
      <div className="container py-lg-4">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <span className="badge rounded-pill bg-success-subtle text-success-emphasis fw-semibold px-3 py-2 mb-3">
              Periféricos con specs comparables
            </span>
            <h1 className="hero-inicio-titulo fw-bold mb-3">
              Elegí por especificaciones, no por suerte.
            </h1>
            <p className="fs-5 text-secondary mb-4">
              Mouses, teclados, auriculares y monitores con sus datos técnicos
              ordenados. Filtrá por lo que importa y compará hasta 4 productos
              lado a lado.
            </p>
            <Link to="/catalogo" className="btn btn-primary btn-lg fw-semibold">
              Ver catálogo
            </Link>
          </div>

          <div className="col-lg-6">
            <VistaPreviaComparador />
          </div>
        </div>
      </div>
    </section>
  );
}
