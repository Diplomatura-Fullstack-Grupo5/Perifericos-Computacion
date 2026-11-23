import { Outlet, useLoaderData } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";

/**
 * Estructura común de las páginas públicas. Las categorías del Navbar vienen del loader de la ruta.
 * @returns {JSX.Element}
 */
export function LayoutPublico() {
  const { categorias } = useLoaderData();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar categorias={categorias} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
