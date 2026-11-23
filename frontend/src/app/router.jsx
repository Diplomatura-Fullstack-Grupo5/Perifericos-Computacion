import { createBrowserRouter } from "react-router";
import { LayoutPublico } from "./layouts/LayoutPublico";
import { InicioPage } from "../features/inicio";
import { CatalogoPage, obtenerCategorias } from "../features/catalogo";
import { MensajeVacio } from "../shared/components/molecules/MensajeVacio";
import { Spinner } from "../shared/components/atoms/Spinner";
import { Legales } from "../features/legal";

/**
 * Loader del layout público: trae las categorías una sola vez para el Navbar y las páginas hijas
 * (que las leen con `useRouteLoaderData("publico")`). Si falla, devuelve una lista vacía para que
 * el sitio siga funcionando sin el menú de categorías.
 * @returns {Promise<{ categorias: string[] }>}
 */
async function cargarLayoutPublico() {
  try {
    return { categorias: await obtenerCategorias() };
  } catch (err) {
    console.error("Error al cargar las categorías:", err);
    return { categorias: [] };
  }
}

/** Rutas de la aplicación. Cada página de una feature se agrega como hija del layout que le corresponde. */
export const router = createBrowserRouter([
  {
    id: "publico",
    path: "/",
    element: <LayoutPublico />,
    loader: cargarLayoutPublico,
    hydrateFallbackElement: <Spinner />,
    // Las categorías no cambian al navegar: sin esto se volverían a pedir con cada filtro del catálogo.
    shouldRevalidate: () => false,
    children: [
      { index: true, element: <InicioPage /> },
      { path: "catalogo", element: <CatalogoPage /> },
      { path: "legales", element: <Legales /> },
      { path: "nosotros", element: <MensajeVacio>Página en construcción.</MensajeVacio> },
      { path: "contacto", element: <MensajeVacio>Página en construcción.</MensajeVacio> },
      { path: "*", element: <MensajeVacio>Página no encontrada.</MensajeVacio> },
    ],
  },
]);
