import { Link } from "react-router";
import "./Footer.css";

const ENLACES = [
  { to: "/catalogo", texto: "Catálogo" },
  { to: "/comparador", texto: "Comparador" },
  { to: "/mis-pedidos", texto: "Mis pedidos" },
  { to: "/ingresar", texto: "Ingresar" },
];

/**
 * Pie de página del sitio público.
 */
export function Footer() {
  return (
    <footer className="footer-sitio py-4">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <p className="fw-bold text-white mb-1">PuntoTech</p>
          <p className="small mb-0">E-commerce de periféricos de computación</p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <ul className="list-unstyled d-flex flex-wrap gap-4 mb-0 small">
            {ENLACES.map((enlace) => (
              <li key={enlace.to}>
                <Link to={enlace.to} className="footer-sitio-enlace">
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="small mb-0">
          Grupo 5 · Diplomatura Full Stack · Proyecto Integrador
        </p>
      </div>
    </footer>
  );
}
