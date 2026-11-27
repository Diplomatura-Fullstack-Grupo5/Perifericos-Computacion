import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { useCarrito } from "../hooks/useCarrito";
import { ItemPanelCarrito } from "./ItemPanelCarrito";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";
import "./PanelCarrito.css";

/**
 * Panel lateral del carrito (offcanvas de Bootstrap controlado por React, sin su JS).
 * Lista los productos con su cantidad, el subtotal y los botones para seguir con la compra.
 * Se cierra con la ×, con Escape o haciendo clic fuera del panel.
 * @returns {JSX.Element | null}
 */
export function PanelCarrito() {
  const {
    items,
    cantidad,
    subtotal,
    cambiarCantidad,
    quitar,
    vaciar,
    panelAbierto,
    cerrarPanel,
  } = useCarrito();
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  const idTitulo = useId();
  const botonCerrar = useRef(null);

  useEffect(() => {
    if (!panelAbierto) return;

    function cerrarConEscape(e) {
      // Con la confirmación de vaciar abierta, Escape cierra solo esa ventana.
      if (e.key === "Escape" && !confirmarVaciar) cerrarPanel();
    }

    document.addEventListener("keydown", cerrarConEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      document.body.style.overflow = "";
    };
  }, [panelAbierto, confirmarVaciar, cerrarPanel]);

  useEffect(() => {
    if (panelAbierto) botonCerrar.current?.focus();
  }, [panelAbierto]);

  if (!panelAbierto) return null;

  const vacio = items.length === 0;

  return createPortal(
    <>
      <aside
        className="offcanvas offcanvas-end show panel-carrito"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        {/* -------------------- Encabezado -------------------- */}
        <div className="offcanvas-header border-bottom">
          <h2 id={idTitulo} className="offcanvas-title fs-5">
            Tu carrito {!vacio && <span className="text-secondary">({cantidad})</span>}
          </h2>
          <button
            ref={botonCerrar}
            type="button"
            className="btn-close"
            aria-label="Cerrar carrito"
            onClick={cerrarPanel}
          />
        </div>

        {/* -------------------- Productos -------------------- */}
        <div className="offcanvas-body d-flex flex-column">
          {vacio ? (
            <div className="m-auto text-center">
              <i className="bi bi-cart3 fs-1 text-secondary" aria-hidden="true" />
              <p className="text-secondary my-3">Tu carrito está vacío.</p>
              <Link to="/catalogo" className="btn btn-primary" onClick={cerrarPanel}>
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <ul className="list-unstyled mb-2">
                {items.map((item) => (
                  <ItemPanelCarrito
                    key={item.id}
                    item={item}
                    onCambiarCantidad={cambiarCantidad}
                    onQuitar={quitar}
                    onIrAProducto={cerrarPanel}
                  />
                ))}
              </ul>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger align-self-start px-0"
                onClick={() => setConfirmarVaciar(true)}
              >
                <i className="bi bi-trash me-1" aria-hidden="true" />
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* -------------------- Subtotal y botones -------------------- */}
        {!vacio && (
          <div className="border-top p-3">
            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <span className="text-secondary">Subtotal</span>
              <span className="fs-5 fw-bold">{formatearPrecio(subtotal)}</span>
            </div>
            {/* TODO: hoy /finalizar-compra y /carrito muestran "Página en construcción" */}
            <div className="d-grid gap-2">
              <Link
                to="/finalizar-compra"
                className="btn btn-primary fw-semibold"
                onClick={cerrarPanel}
              >
                Finalizar compra
              </Link>
              <Link to="/carrito" className="btn btn-outline-primary" onClick={cerrarPanel}>
                Ver carrito
              </Link>
            </div>
          </div>
        )}
      </aside>
      <div className="offcanvas-backdrop fade show" onClick={cerrarPanel} />

      <ModalConfirmacion
        abierto={confirmarVaciar}
        titulo="Vaciar carrito"
        textoConfirmar="Vaciar"
        onConfirmar={() => {
          vaciar();
          setConfirmarVaciar(false);
        }}
        onCancelar={() => setConfirmarVaciar(false)}
      >
        ¿Querés quitar {cantidad === 1 ? "el producto" : `los ${cantidad} productos`} del carrito?
      </ModalConfirmacion>
    </>,
    document.body,
  );
}
