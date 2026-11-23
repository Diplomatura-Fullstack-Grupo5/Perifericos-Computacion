import { Outlet } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";

/**
 * Estructura común de las páginas públicas.
 */
export function LayoutPublico() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* TODO: reemplazar por el Navbar de shared/components/organisms */}
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
