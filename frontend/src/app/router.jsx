import { createBrowserRouter } from "react-router";
import { LayoutPublico } from "./layouts/LayoutPublico";
import { LayoutPrivado } from "./layouts/LayoutPrivado";
import { InicioPage } from "../features/inicio";
import { CatalogoPage, obtenerCategorias } from "../features/catalogo";
import { RegistroPage } from "../features/auth";
import { MensajeVacio } from "../shared/components/molecules/MensajeVacio";
import { Spinner } from "../shared/components/atoms/Spinner";
import { Legales } from "../features/legal";
import { ComparadorPage } from "../features/comparador";
import { NosotrosPage } from "../features/nosotros";
import { ContactoPage } from "../features/contacto";
import {
  ProductoPage,
  AdminProductosPage,
  AdminFormularioProductoPage,
} from "../features/productos";
import { AdminDashboardPage } from "../features/dashboard";
import { AdminPedidosPage } from "../features/pedidos";

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

/**
 * Rutas que todavía no tienen página: muestran "Página en construcción".
 * Al crear la página real, quitarla de esta lista y agregar su ruta abajo.
 */
const PAGINAS_EN_CONSTRUCCION = [
  "carrito",
  "iniciar-sesion",
  "mis-pedidos",
];

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
      { path: "producto/:id", element: <ProductoPage /> },
      { path: "comparador", element: <ComparadorPage /> },
      { path: "legales", element: <Legales /> },
      { path: "nosotros", element: <NosotrosPage /> },
      { path: "contacto", element: <ContactoPage /> },
      ...PAGINAS_EN_CONSTRUCCION.map((path) => ({
        path,
        element: <MensajeVacio>Página en construcción.</MensajeVacio>,
      })),
      { path: "registrarse", element: <RegistroPage /> },
      { path: "*", element: <MensajeVacio>Página no encontrada.</MensajeVacio> },
    ],
  },
  {
    // Panel de administración. Cada sección vive en la feature de su dominio (productos, pedidos…)
    // y sus páginas llevan el prefijo `Admin`.
    path: "/admin",
    element: <LayoutPrivado />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "productos", element: <AdminProductosPage /> },
      { path: "productos/nuevo", element: <AdminFormularioProductoPage /> },
      { path: "productos/:id/editar", element: <AdminFormularioProductoPage /> },
      { path: "pedidos", element: <AdminPedidosPage /> },
      { path: "*", element: <MensajeVacio>Página no encontrada.</MensajeVacio> },
    ],
  },
]);
