import { Link } from "react-router";
import "./Footer.css";

const ENLACES = [
  { to: "/legales#terminos", texto: "Términos y condiciones" },
  { to: "/legales#privacidad", texto: "Política de privacidad" },
  { to: "/legales#devoluciones", texto: "Cambios y devoluciones" },
  { to: "/legales#arrepentimiento", texto: "Botón de arrepentimiento" },
];

/**
 * Pie de página del sitio público.
 */
export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer-sitio py-4">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <Link to="/" aria-label="PuntoTech, ir al inicio">
            <img src="/icon.svg" alt="PuntoTech" height="28" className="mb-1" />
          </Link>
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
          © {anio} PuntoTech · Grupo 5 · Diplomatura Full Stack · Proyecto Integrador
        </p>
      </div>
    </footer>
  );
}