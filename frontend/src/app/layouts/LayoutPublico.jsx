import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";
import { obtenerCategorias } from "../../features/catalogo";

/**
 * Estructura común de las páginas públicas. Carga las categorías para el menú del Navbar.
 * @returns {JSX.Element}
 */
export function LayoutPublico() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    let ignoreResponse = false;

    obtenerCategorias()
      .then((data) => {
        if (!ignoreResponse) setCategorias(data);
      })
      .catch((err) => {
        if (!ignoreResponse) console.error("Error al cargar las categorías del menú:", err);
      });

    return () => {
      ignoreResponse = true;
    };
  }, []);

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
