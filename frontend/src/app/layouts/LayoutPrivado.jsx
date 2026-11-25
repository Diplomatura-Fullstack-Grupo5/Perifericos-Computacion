import { Link, NavLink, Outlet } from "react-router";

/**
 * Estructura común de las páginas del panel de administración: barra con las secciones del panel
 * y un enlace para volver a la tienda.
 * Todavía no controla el acceso: eso llega con el inicio de sesión (loader `protegerRuta`). Aun así,
 * la protección real será la del backend (`auth` + `requiereRol`), no la de esta interfaz.
 * @returns {JSX.Element}
 */
export function LayoutPrivado() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
      <nav
        className="navbar navbar-expand bg-dark"
        data-bs-theme="dark"
        aria-label="Panel de administración"
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
            <img src="/icon.svg" alt="PuntoTech" height="28" />
            <span className="fs-6 text-secondary d-none d-sm-inline">Administración</span>
          </Link>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/productos">
                Productos
              </NavLink>
            </li>
          </ul>
          <Link className="btn btn-sm btn-outline-light text-nowrap" to="/">
            <i className="bi bi-shop me-1" aria-hidden="true" />
            Ver tienda
          </Link>
        </div>
      </nav>
      <main className="flex-grow-1 container py-4">
        <Outlet />
      </main>
    </div>
  );
}
