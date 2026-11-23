import { Link } from "react-router";
import "./Navbar.css";

/**
 * Barra de navegación superior del sitio público.
 * @param {object} props
 * @param {string[]} props.categorias Nombres de las categorías del menú "Catálogo".
 * @returns {JSX.Element}
 */
export function Navbar({ categorias }) {
  // TODO: conectar a ComparadorContext / CarritoContext cuando existan
  const compareCount = 0;
  const cartCount = 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container">
        {/* -------------------- Marca -------------------- */}
        <Link className="navbar-brand" to="/">
          <img src="/icon.svg" alt="PuntoTech - Inicio" />
        </Link>
        {/* -------------------- Botón hamburguesa (mobile) -------------------- */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContenido"
          aria-controls="navbarContenido"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse gap-3" id="navbarContenido">
          {/* -------------------- Links -------------------- */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                type="button"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Catálogo
              </button>
              <ul className="dropdown-menu app-navbar-dropdown">
                <li>
                  <h6 className="dropdown-header">Categorías</h6>
                </li>
                {categorias.map((categoria) => (
                  <li key={categoria}>
                    <Link
                      className="dropdown-item"
                      to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                    >
                      {categoria}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* TODO: reemplazar el mensaje de /nosotros y /contacto por las páginas reales cuando existan */}
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                Contacto
              </Link>
            </li>
          </ul>

          {/* -------------------- Buscador (solo visual) -------------------- */}
          <form
            className="flex-grow-1 my-2 my-lg-0"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Buscar periféricos..."
              aria-label="Buscar periféricos"
            />
          </form>

          {/* -------------------- Comparar y carrito (solo visual) -------------------- */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0 text-nowrap">
            <button type="button" className="btn btn-sm app-navbar-btn">
              ⇄ Comparar ({compareCount})
            </button>
            <button
              type="button"
              className="btn btn-sm app-navbar-btn"
              aria-label="Carrito"
            >
              🛒 {cartCount}
            </button>
            <span className="app-navbar-divider" aria-hidden="true"></span>
            {/* TODO: redirigir a la página de inicio de sesión */}
            <a className="btn btn-sm app-navbar-btn-outline" href="#">
              Log In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
