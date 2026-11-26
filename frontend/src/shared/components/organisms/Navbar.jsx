import { useState } from "react";
import { Link } from "react-router";
import { ModalConfirmacion } from "../molecules/ModalConfirmacion";
import "./Navbar.css";

/**
 * Barra de navegación superior del sitio público.
 * @param {object} props
 * @param {string[]} props.categorias Nombres de las categorías del menú "Catálogo".
 * @param {number} [props.cantidadComparar] Productos elegidos para comparar.
 * @param {() => void} [props.onVaciarComparador] Vacía el comparador (se pide confirmación antes).
 * @returns {JSX.Element}
 */
export function Navbar({ categorias, cantidadComparar = 0, onVaciarComparador }) {
  // TODO: conectar al carrito cuando exista
  const cartCount = 0;
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  /**
   * Cierra el menú plegado (celular) al elegir un enlace, para que no tape la página nueva.
   * @param {import("react").MouseEvent} evento
   */
  function handleClickMenu(evento) {
    if (evento.target.closest("a")) setMenuAbierto(false);
  }

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
          aria-controls="navbarContenido"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* El menú se abre y se cierra con el estado de React (no con Bootstrap JS), así se puede
            cerrar al navegar. */}
        <div
          className={`collapse navbar-collapse gap-3 ${menuAbierto ? "show" : ""}`}
          id="navbarContenido"
          onClick={handleClickMenu}
        >
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

          {/* -------------------- Comparar, carrito y sesión -------------------- */}
          {/* TODO: hoy /carrito e /iniciar-sesion muestran "Página en construcción" */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0 text-nowrap">
            <div className="btn-group btn-group-sm">
              <Link className="btn app-navbar-btn" to="/comparador">
                ⇄ Comparar ({cantidadComparar})
              </Link>
              {cantidadComparar > 0 && onVaciarComparador && (
                <button
                  type="button"
                  className="btn app-navbar-btn app-navbar-btn-tacho"
                  aria-label="Vaciar comparador"
                  title="Vaciar comparador"
                  onClick={() => setConfirmarVaciar(true)}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              )}
            </div>
            <Link
              className="btn btn-sm app-navbar-btn"
              to="/carrito"
              aria-label={`Carrito (${cartCount})`}
            >
              🛒 {cartCount}
            </Link>
            <span className="app-navbar-divider" aria-hidden="true"></span>
            <Link className="btn btn-sm app-navbar-btn-outline" to="/iniciar-sesion">
              Log In
            </Link>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        abierto={confirmarVaciar}
        titulo="Vaciar comparador"
        textoConfirmar="Vaciar"
        onConfirmar={() => {
          onVaciarComparador();
          setConfirmarVaciar(false);
        }}
        onCancelar={() => setConfirmarVaciar(false)}
      >
        ¿Querés quitar los {cantidadComparar}{" "}
        {cantidadComparar === 1 ? "producto" : "productos"} del comparador?
      </ModalConfirmacion>
    </nav>
  );
}
