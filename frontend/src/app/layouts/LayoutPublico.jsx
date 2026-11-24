import { Outlet, useLoaderData } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";
import { useComparador } from "../../features/comparador";

/**
 * Estructura común de las páginas públicas. Las categorías del Navbar vienen del loader de la ruta,
 * y la cantidad de productos a comparar, del comparador.
 * @returns {JSX.Element}
 */
export function LayoutPublico() {
  const { categorias } = useLoaderData();
  const { cantidad, vaciar } = useComparador();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        categorias={categorias}
        cantidadComparar={cantidad}
        onVaciarComparador={vaciar}
      />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
