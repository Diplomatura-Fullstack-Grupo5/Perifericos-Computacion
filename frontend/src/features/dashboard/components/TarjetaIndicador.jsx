import { formatearPorcentaje, formatearPuntosPorcentuales } from "../utils/formatos";
import "./TarjetaIndicador.css";

/**
 * Tarjeta con un indicador del dashboard: título, valor destacado, ícono y, si se pasa, la
 * variación respecto del período anterior (con flecha y texto, no solo color).
 * @param {object} props
 * @param {string} props.titulo Qué mide (ej. "TPV").
 * @param {string | number} props.valor Valor ya formateado.
 * @param {string} props.icono Nombre del ícono de Bootstrap Icons, sin el prefijo `bi-`.
 * @param {string} [props.descripcion] Aclaración breve de qué mide.
 * @param {number | null} [props.variacion] Variación en % respecto del período anterior.
 * @param {boolean} [props.mejorSiBaja] `true` si una baja es buena (ej. tasa de cancelación).
 * @param {boolean} [props.variacionEnPuntos] `true` si la variación es una diferencia en puntos
 *   porcentuales (para tasas) y no un porcentaje.
 * @returns {JSX.Element}
 */
export function TarjetaIndicador({
  titulo,
  valor,
  icono,
  descripcion,
  variacion,
  mejorSiBaja = false,
  variacionEnPuntos = false,
}) {
  const hayVariacion = variacion !== undefined && variacion !== null;
  const sube = variacion > 0;
  const baja = variacion < 0;
  const iconoVariacion = sube ? "bi-arrow-up-right" : baja ? "bi-arrow-down-right" : "bi-arrow-right";
  let color = "text-secondary";
  if (sube || baja) color = sube !== mejorSiBaja ? "text-success" : "text-danger";

  return (
    <div className="card h-100">
      <div className="card-body d-flex align-items-start gap-3">
        <span className="tarjeta-indicador__icono" aria-hidden="true">
          <i className={`bi bi-${icono}`} />
        </span>
        <div>
          <h2 className="fs-6 fw-normal text-secondary mb-1">{titulo}</h2>
          <p className="fs-4 fw-semibold mb-0 lh-sm">{valor}</p>
          {descripcion && <p className="small text-secondary mb-0">{descripcion}</p>}
          {hayVariacion && (
            <p className={`small mb-0 mt-1 ${color}`}>
              <i className={`bi ${iconoVariacion} me-1`} aria-hidden="true" />
              {sube ? "+" : ""}
              {variacionEnPuntos
                ? formatearPuntosPorcentuales(variacion)
                : formatearPorcentaje(variacion)}
              <span className="text-secondary"> vs. período anterior</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
