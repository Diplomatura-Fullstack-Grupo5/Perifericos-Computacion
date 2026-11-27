import { Link, NavLink } from "react-router";
import "./Navbar.css";

/**
 * Barra de navegación del panel de administración. Usa el mismo estilo y el mismo menú plegable
 * (Bootstrap collapse) que la del sitio público, con las secciones del panel y un enlace para
 * volver a la tienda.
 * @param {object} props
 * @param {{ to: string, texto: string, end?: boolean }[]} props.secciones Secciones del panel, en
 *   orden. Con `end`, la sección se marca como actual solo en su ruta exacta.
 * @returns {JSX.Element}
 */
export function NavbarPanel({ secciones }) {
  return (
    <nav
      className="navbar navbar-expand-md navbar-dark app-navbar sticky-top"
      aria-label="Panel de administración"
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
          <img src="/icon.svg" alt="PuntoTech" />
          <span className="app-navbar-etiqueta d-none d-sm-inline">Administración</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarPanelContenido"
          aria-controls="navbarPanelContenido"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse gap-3" id="navbarPanelContenido">
          <ul className="navbar-nav me-auto">
            {secciones.map((seccion) => (
              <li key={seccion.to} className="nav-item">
                <NavLink className="nav-link" to={seccion.to} end={seccion.end}>
                  {seccion.texto}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link className="btn btn-sm app-navbar-btn-outline text-nowrap my-2 my-md-0" to="/">
            <i className="bi bi-shop me-1" aria-hidden="true" />
            Ver tienda
          </Link>
        </div>
      </div>
    </nav>
  );
}
