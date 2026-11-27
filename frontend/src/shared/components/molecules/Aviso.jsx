/** Ícono de cada tipo de aviso. */
const ICONOS = { success: "bi-check-circle-fill", danger: "bi-exclamation-triangle-fill" };

/**
 * Aviso que se puede cerrar, para el resultado de una acción (ej. "Se eliminó el producto"). Usa
 * el mismo diseño que el aviso de éxito del formulario de contacto.
 * @param {object} props
 * @param {"success" | "danger"} props.tipo Color del aviso.
 * @param {import("react").ReactNode} props.children Mensaje.
 * @param {() => void} props.onCerrar
 * @returns {JSX.Element}
 */
export function Aviso({ tipo, children, onCerrar }) {
  return (
    <div
      className={`alert alert-${tipo} alert-dismissible d-flex align-items-center gap-2`}
      role="status"
    >
      <i className={`bi ${ICONOS[tipo]}`} aria-hidden="true" />
      <span>{children}</span>
      <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={onCerrar} />
    </div>
  );
}
