import { useId } from "react";

/**
 * Tarjeta con título para cada sección del dashboard.
 * @param {object} props
 * @param {string} props.titulo
 * @param {import("react").ReactNode} [props.accion] Enlace o control a la derecha del título.
 * @param {boolean} [props.sinMargen] `true` si el contenido va pegado a los bordes (listas, tablas).
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function SeccionDashboard({ titulo, accion, sinMargen = false, children }) {
  const idTitulo = useId();

  return (
    <section className="card h-100 overflow-hidden" aria-labelledby={idTitulo}>
      <div className={`card-body flex-grow-0 d-flex justify-content-between align-items-baseline gap-2 ${sinMargen ? "pb-2" : "pb-0"}`}>
        <h2 id={idTitulo} className="fs-5 mb-0">
          {titulo}
        </h2>
        {accion}
      </div>
      {sinMargen ? children : <div className="card-body pt-3">{children}</div>}
    </section>
  );
}
