import { useState } from "react";
import { Link, useOutletContext } from "react-router";
import { useCarrito } from "../../carrito";
import { crearPedido } from "../services/pedidosService";
import { AvisoSesion } from "../components/AvisoSesion";
import { AvisoCambiosCarrito } from "../components/AvisoCambiosCarrito";
import { ResumenPedido } from "../components/ResumenPedido";
import { FormularioComprador } from "../components/FormularioComprador";
import { PedidoConfirmado } from "../components/PedidoConfirmado";

/**
 * Página para finalizar la compra: sin sesión, ofrece iniciarla; con sesión, completa el nombre y
 * el email con los de la cuenta. Pide los datos del comprador y muestra el resumen del carrito. Al
 * confirmar guarda el pedido, vacía el carrito y muestra el número de pedido. Si cambiaron precios
 * o stock, actualiza el carrito y lo avisa sin guardar nada.
 * @returns {JSX.Element}
 */
export function FinalizarCompraPage() {
  const { usuario } = useOutletContext();
  const { items, subtotal, abrirPanel, actualizarProductos, vaciar } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [cambios, setCambios] = useState([]);
  const [error, setError] = useState(null);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  async function confirmar(comprador) {
    setEnviando(true);
    setCambios([]);
    setError(null);

    try {
      const resultado = await crearPedido(comprador, items, usuario);
      if (resultado.cambios) {
        actualizarProductos(resultado.productosActuales);
        setCambios(resultado.cambios);
      } else {
        // El pedido guardado no tiene imágenes: se toman del carrito antes de vaciarlo.
        const imagenes = Object.fromEntries(items.map((item) => [item.id, item.image]));
        vaciar();
        setPedidoConfirmado({ pedido: resultado.pedido, imagenes });
      }
    } catch (err) {
      console.error("Error al confirmar el pedido:", err);
      setError("No se pudo confirmar el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (pedidoConfirmado) {
    return (
      <PedidoConfirmado pedido={pedidoConfirmado.pedido} imagenes={pedidoConfirmado.imagenes} />
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <AvisoCambiosCarrito cambios={cambios} />
        <div className="text-center">
          <i className="bi bi-cart3 fs-1 text-secondary" aria-hidden="true" />
          <p className="text-secondary my-3">Tu carrito está vacío.</p>
          <Link to="/catalogo" className="btn btn-primary">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="fs-3 fw-bold mb-4">Finalizar compra</h1>

      <AvisoCambiosCarrito cambios={cambios} />
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* -------------------- Columna izquierda: Sesión y datos -------------------- */}
        <div className="col-lg-7">
          {!usuario && <AvisoSesion />}
          <FormularioComprador
            usuario={usuario}
            total={subtotal}
            enviando={enviando}
            onConfirmar={confirmar}
          />
        </div>

        {/* -------------------- Columna derecha: Resumen -------------------- */}
        <div className="col-lg-5">
          <ResumenPedido items={items} total={subtotal} onEditar={abrirPanel} />
        </div>
      </div>
    </div>
  );
}
