import { Link, NavLink } from "react-router";
import "./Navbar.css";

/**
 * Barra de navegación del panel de administración. Usa el mismo estilo que la del sitio público,
 * pero con las secciones del panel y un enlace para volver a la tienda.
 * @param {object} props
 * @param {{ to: string, texto: string }[]} props.secciones Secciones del panel, en orden.
 * @returns {JSX.Element}
 */
export function NavbarPanel({ secciones }) {
  return (
    <nav
      className="navbar navbar-expand navbar-dark app-navbar sticky-top"
      aria-label="Panel de administración"
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
          <img src="/icon.svg" alt="PuntoTech" />
          <span className="app-navbar-etiqueta d-none d-sm-inline">Administración</span>
        </Link>

        <ul className="navbar-nav me-auto">
          {secciones.map((seccion) => (
            <li key={seccion.to} className="nav-item">
              <NavLink className="nav-link" to={seccion.to}>
                {seccion.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link className="btn btn-sm app-navbar-btn-outline text-nowrap" to="/">
          <i className="bi bi-shop me-1" aria-hidden="true" />
          Ver tienda
        </Link>
      </div>
    </nav>
  );
}
