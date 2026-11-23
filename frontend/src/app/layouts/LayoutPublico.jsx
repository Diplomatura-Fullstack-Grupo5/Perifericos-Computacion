import { Outlet } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";

/**
 * Estructura común de las páginas públicas.
 */
export function LayoutPublico() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
