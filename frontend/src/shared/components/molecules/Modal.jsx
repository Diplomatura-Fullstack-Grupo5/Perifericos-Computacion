import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

/**
 * Ventana modal con el estilo de Bootstrap, controlada por React (sin el JS de Bootstrap).
 * Se cierra con la ×, con Escape o haciendo clic fuera del cuadro.
 * @param {object} props
 * @param {boolean} props.abierto
 * @param {string} props.titulo
 * @param {import("react").ReactNode} props.children Contenido del cuerpo.
 * @param {import("react").ReactNode} [props.pie] Botones del pie.
 * @param {() => void} props.onCerrar
 * @returns {JSX.Element | null}
 */
export function Modal({ abierto, titulo, children, pie, onCerrar }) {
  const idTitulo = useId();

  useEffect(() => {
    if (!abierto) return;

    function cerrarConEscape(e) {
      if (e.key === "Escape") onCerrar();
    }

    document.addEventListener("keydown", cerrarConEscape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      document.body.classList.remove("modal-open");
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return createPortal(
    <>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onClick={onCerrar}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 id={idTitulo} className="modal-title fs-5">
                {titulo}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onCerrar}
              />
            </div>
            <div className="modal-body">{children}</div>
            {pie && <div className="modal-footer">{pie}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>,
    document.body,
  );
}
