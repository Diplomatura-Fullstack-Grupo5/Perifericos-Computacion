import "./TarjetaIndicador.css";

/**
 * Tarjeta con un indicador del dashboard: un título, el valor destacado y un ícono.
 * @param {object} props
 * @param {string} props.titulo Qué mide (ej. "Ventas").
 * @param {string | number} props.valor Valor ya formateado.
 * @param {string} props.icono Nombre del ícono de Bootstrap Icons, sin el prefijo `bi-`.
 * @param {string} [props.detalle] Aclaración breve debajo del valor.
 * @returns {JSX.Element}
 */
export function TarjetaIndicador({ titulo, valor, icono, detalle }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex align-items-start gap-3">
        <span className="tarjeta-indicador__icono" aria-hidden="true">
          <i className={`bi bi-${icono}`} />
        </span>
        <div>
          <h2 className="fs-6 fw-normal text-secondary mb-1">{titulo}</h2>
          <p className="fs-4 fw-semibold mb-0">{valor}</p>
          {detalle && <p className="small text-secondary mb-0">{detalle}</p>}
        </div>
      </div>
    </div>
  );
}
