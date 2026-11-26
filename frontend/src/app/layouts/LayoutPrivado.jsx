import { Outlet } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { NavbarPanel } from "../../shared/components/organisms/NavbarPanel";

/** Secciones del panel que aparecen en la barra. Cada issue de admin suma la suya. */
const SECCIONES_PANEL = [{ to: "/admin/productos", texto: "Productos" }];

/**
 * Estructura común de las páginas del panel de administración: la barra del panel (con el mismo
 * estilo que la del sitio público), el contenido y el pie de página del sitio.
 * Todavía no controla el acceso: eso llega con el inicio de sesión (loader `protegerRuta`). Aun así,
 * la protección real será la del backend (`auth` + `requiereRol`), no la de esta interfaz.
 * @returns {JSX.Element}
 */
export function LayoutPrivado() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPanel secciones={SECCIONES_PANEL} />
      <main className="flex-grow-1 container py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
