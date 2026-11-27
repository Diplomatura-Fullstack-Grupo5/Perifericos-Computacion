import { Outlet, useNavigate } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { NavbarPanel } from "../../shared/components/organisms/NavbarPanel";
import { cerrarSesion } from "../../features/auth";

/**
 * Secciones de la barra del panel. `end` marca el dashboard (`/admin`) como actual solo en su ruta
 * exacta; si no, quedaría marcado en todas las secciones.
 */
const SECCIONES_PANEL = [
  { to: "/admin", texto: "Dashboard", end: true },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/pedidos", texto: "Pedidos" },
  { to: "/admin/usuarios", texto: "Usuarios" },
];

/**
 * Estructura común de las páginas del panel de administración: la barra del panel (con el mismo
 * estilo que la del sitio público), el contenido y el pie de página del sitio.
 * El router protege el acceso a este layout; la API real también deberá validar el rol.
 * @returns {JSX.Element}
 */
export function LayoutPrivado() {
  const navegar = useNavigate();

  function manejarCerrarSesion() {
    cerrarSesion();
    navegar("/iniciar-sesion", { replace: true });
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPanel
        secciones={SECCIONES_PANEL}
        onCerrarSesion={manejarCerrarSesion}
      />
      <main className="flex-grow-1 container py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
