import { useState } from "react";
import { Link, NavLink } from "react-router";
import "./Navbar.css";

/**
 * Barra de navegación del panel de administración. Usa el mismo estilo que la del sitio público,
 * pero con las secciones del panel y un enlace para volver a la tienda. En pantallas chicas, las
 * secciones se pliegan en un menú que abre y cierra el estado de React (no Bootstrap JS), para
 * poder cerrarlo al elegir una sección.
 * @param {object} props
 * @param {{ to: string, texto: string, end?: boolean }[]} props.secciones Secciones del panel, en
 *   orden. Con `end`, la sección se marca como actual solo en su ruta exacta.
 * @returns {JSX.Element}
 */
export function NavbarPanel({ secciones }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

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
          aria-controls="navbarPanelContenido"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse gap-3 ${menuAbierto ? "show" : ""}`}
          id="navbarPanelContenido"
        >
          <ul className="navbar-nav me-auto">
            {secciones.map((seccion) => (
              <li key={seccion.to} className="nav-item">
                <NavLink
                  className="nav-link"
                  to={seccion.to}
                  end={seccion.end}
                  onClick={cerrarMenu}
                >
                  {seccion.texto}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            className="btn btn-sm app-navbar-btn-outline text-nowrap my-2 my-md-0"
            to="/"
            onClick={cerrarMenu}
          >
            <i className="bi bi-shop me-1" aria-hidden="true" />
            Ver tienda
          </Link>
        </div>
      </div>
    </nav>
  );
}
