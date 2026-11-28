import { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { Footer } from "../../shared/components/organisms/Footer";
import { Navbar } from "../../shared/components/organisms/Navbar";
import { useComparador } from "../../features/comparador";
import { PanelCarrito, useCarrito } from "../../features/carrito";
import { cerrarSesion, obtenerSesion } from "../../features/auth";
import { BuscadorProductos } from "../../features/productos";

/**
 * Estructura común de las páginas públicas. Las categorías del Navbar vienen del loader de la ruta,
 * y su buscador, de la feature `productos`;
 * la cantidad de productos a comparar, del comparador; la de unidades en el carrito, del carrito, y
 * el usuario, de la sesión guardada. Las páginas reciben `usuario` y `actualizarUsuario` con
 * `useOutletContext()`. También monta el panel lateral del carrito, que se abre desde el Navbar o
 * al agregar un producto.
 * @returns {JSX.Element}
 */
export function LayoutPublico() {
  const { categorias } = useLoaderData();
  const comparador = useComparador();
  const carrito = useCarrito();
  const [usuario, actualizarUsuario] = useState(() => obtenerSesion());

  function manejarCerrarSesion() {
    cerrarSesion();
    actualizarUsuario(null);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        categorias={categorias}
        buscador={<BuscadorProductos />}
        cantidadComparar={comparador.cantidad}
        onVaciarComparador={comparador.vaciar}
        cantidadCarrito={carrito.cantidad}
        onAbrirCarrito={carrito.abrirPanel}
        usuario={usuario}
        onCerrarSesion={manejarCerrarSesion}
      />
      <main className="flex-grow-1">
        <Outlet context={{ usuario, actualizarUsuario }} />
      </main>
      <Footer />
      <PanelCarrito />
    </div>
  );
}
