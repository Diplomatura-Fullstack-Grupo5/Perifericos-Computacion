import { Modal } from "./Modal";

/**
 * Modal que pide confirmar una acción (ej. vaciar el comparador). Por defecto el botón de confirmar es
 * rojo, para las acciones destructivas.
 * @param {object} props
 * @param {boolean} props.abierto
 * @param {string} props.titulo
 * @param {import("react").ReactNode} props.children Mensaje.
 * @param {string} [props.textoConfirmar] Texto del botón de confirmar.
 * @param {string} [props.textoCancelar] Texto del botón que cierra sin confirmar.
 * @param {string} [props.claseConfirmar] Clase de Bootstrap del botón de confirmar (ej. `btn-primary`).
 * @param {() => void} props.onConfirmar
 * @param {() => void} props.onCancelar También se llama al cerrar el modal sin confirmar.
 * @returns {JSX.Element | null}
 */
export function ModalConfirmacion({
  abierto,
  titulo,
  children,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  claseConfirmar = "btn-danger",
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
            {textoCancelar}
          </button>
          <button type="button" className={`btn ${claseConfirmar}`} onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
