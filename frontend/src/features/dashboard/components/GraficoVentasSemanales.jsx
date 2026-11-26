import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./GraficoVentasSemanales.css";

/**
 * Convierte el lunes de una semana (`"AAAA-MM-DD"`) en el texto a mostrar (ej. "17/11").
 * @param {string} dia
 * @returns {string}
 */
function formatearSemana(dia) {
  const [, mes, numero] = dia.split("-");
  return `${numero}/${mes}`;
}

/**
 * Gráfico de barras horizontales con las ventas de cada semana. Cada barra mide en proporción a la
 * semana de más ventas; el monto se muestra también como texto.
 * @param {object} props
 * @param {{ inicio: string, total: number }[]} props.semanas De la más vieja a la más nueva.
 * @returns {JSX.Element}
 */
export function GraficoVentasSemanales({ semanas }) {
  const maximo = Math.max(1, ...semanas.map((semana) => semana.total));

  return (
    <ol className="list-unstyled mb-0 grafico-ventas">
      {semanas.map((semana) => (
        <li key={semana.inicio} className="grafico-ventas__fila">
          <span className="small text-secondary">
            <span className="visually-hidden">Semana del </span>
            {formatearSemana(semana.inicio)}
          </span>
          <span className="grafico-ventas__pista" aria-hidden="true">
            <span
              className="grafico-ventas__barra"
              style={{ width: `${(semana.total / maximo) * 100}%` }}
            />
          </span>
          <span className="small text-end">{formatearPrecio(semana.total)}</span>
        </li>
      ))}
    </ol>
  );
}
