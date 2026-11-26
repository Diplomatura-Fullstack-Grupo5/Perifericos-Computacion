import { Link } from "react-router";
import "./EncabezadoPagina.css";

/**
 * Encabezado de las páginas institucionales (Nosotros, Contacto): banda con fondo degradado,
 * migas "Inicio / título", el título principal y un texto de introducción.
 * @param {object} props
 * @param {string} props.titulo Título de la página (también se usa en las migas).
 * @param {import("react").ReactNode} [props.children] Texto de introducción.
 * @returns {JSX.Element}
 */
export function EncabezadoPagina({ titulo, children }) {
  return (
    <header className="encabezado-pagina">
      <div className="container py-4 py-lg-5">
        <nav aria-label="Migas de pan">
          <ol className="breadcrumb small mb-2">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {titulo}
            </li>
          </ol>
        </nav>
        <h1 className="encabezado-pagina-titulo fw-bold mb-3">{titulo}</h1>
        {children && <div className="encabezado-pagina-intro">{children}</div>}
      </div>
    </header>
  );
}
