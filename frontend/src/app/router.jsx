import { createBrowserRouter } from "react-router";
import { LayoutPublico } from "./layouts/LayoutPublico";
import { CatalogoPage } from "../features/catalogo";

/** Rutas de la aplicación. Cada página de una feature se agrega como hija del layout que le corresponde. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublico />,
    children: [{ index: true, element: <CatalogoPage /> }],
  },
]);
