import { createBrowserRouter } from "react-router";
import { LayoutPublico } from "./layouts/LayoutPublico";
import { InicioPage } from "../features/inicio";
import { CatalogoPage } from "../features/catalogo";
import { MensajeVacio } from "../shared/components/molecules/MensajeVacio";

/** Rutas de la aplicación. Cada página de una feature se agrega como hija del layout que le corresponde. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublico />,
    children: [
      { index: true, element: <InicioPage /> },
      { path: "catalogo", element: <CatalogoPage /> },
      { path: "*", element: <MensajeVacio>Página no encontrada.</MensajeVacio> },
    ],
  },
]);
