import { Outlet, useLoaderData } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";
import { useComparador } from "../../features/comparador";
import { PanelCarrito, useCarrito } from "../../features/carrito";

/**
 * Estructura común de las páginas públicas. Las categorías del Navbar vienen del loader de la ruta;
 * la cantidad de productos a comparar, del comparador, y la de unidades en el carrito, del carrito.
 * También monta el panel lateral del carrito, que se abre desde el Navbar o al agregar un producto.
 * @returns {JSX.Element}
 */
export function LayoutPublico() {
  const { categorias } = useLoaderData();
  const comparador = useComparador();
  const carrito = useCarrito();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        categorias={categorias}
        cantidadComparar={comparador.cantidad}
        onVaciarComparador={comparador.vaciar}
        cantidadCarrito={carrito.cantidad}
        onAbrirCarrito={carrito.abrirPanel}
      />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <PanelCarrito />
    </div>
  );
}
