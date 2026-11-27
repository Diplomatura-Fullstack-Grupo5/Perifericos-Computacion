/**
 * Aviso que se puede cerrar, para el resultado de una acción (ej. "Se eliminó el producto").
 * @param {object} props
 * @param {"success" | "danger"} props.tipo Color del aviso.
 * @param {import("react").ReactNode} props.children Mensaje.
 * @param {() => void} props.onCerrar
 * @returns {JSX.Element}
 */
export function Aviso({ tipo, children, onCerrar }) {
  return (
    <div className={`alert alert-${tipo} d-flex align-items-start`} role="status">
      <span className="flex-grow-1">{children}</span>
      <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={onCerrar} />
    </div>
  );
}
