import { Modal } from "./Modal";

/**
 * Modal que pide confirmar una acción destructiva (ej. vaciar el comparador).
 * @param {object} props
 * @param {boolean} props.abierto
 * @param {string} props.titulo
 * @param {import("react").ReactNode} props.children Mensaje.
 * @param {string} [props.textoConfirmar] Texto del botón de confirmar.
 * @param {() => void} props.onConfirmar
 * @param {() => void} props.onCancelar También se llama al cerrar el modal sin confirmar.
 * @returns {JSX.Element | null}
 */
export function ModalConfirmacion({
  abierto,
  titulo,
  children,
  textoConfirmar = "Confirmar",
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal
      abierto={abierto}
      titulo={titulo}
      onCerrar={onCancelar}
      pie={
        <>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
            autoFocus
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
