import "./GraficoBarrasHorizontales.css";

/**
 * Gráfico de barras horizontales de una sola serie. Cada barra mide en proporción al valor más
 * alto, y su valor se muestra también como texto (el gráfico se lee sin depender del largo).
 * @param {object} props
 * @param {{ clave: string, etiqueta: string, valor: number, texto: string, detalle?: string }[]} props.filas
 *   `valor` define el largo de la barra; `texto` y `detalle` se muestran a la derecha.
 * @returns {JSX.Element}
 */
export function GraficoBarrasHorizontales({ filas }) {
  const maximo = Math.max(1, ...filas.map((fila) => fila.valor));

  return (
    <ul className="list-unstyled mb-0">
      {filas.map((fila) => (
        <li key={fila.clave} className="barras-horizontales-fila">
          <div className="d-flex justify-content-between gap-2 small mb-1">
            <span>{fila.etiqueta}</span>
            <span className="text-nowrap">
              <strong>{fila.texto}</strong>
              {fila.detalle && <span className="text-secondary"> · {fila.detalle}</span>}
            </span>
          </div>
          <span className="barras-horizontales-pista" aria-hidden="true">
            <span
              className="barras-horizontales-barra"
              style={{ width: `${(fila.valor / maximo) * 100}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
