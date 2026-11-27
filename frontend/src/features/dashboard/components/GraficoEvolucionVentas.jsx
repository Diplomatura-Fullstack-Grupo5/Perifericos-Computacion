import { useState } from "react";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearDiaCorto, formatearMontoCorto } from "../utils/formatos";
import "./GraficoEvolucionVentas.css";

/** Cantidad aproximada de etiquetas en el eje horizontal, para que no se pisen. */
const ETIQUETAS_EJE_X = 8;

/**
 * Redondea hacia arriba a un valor "lindo" para el tope del eje (1, 2 o 5 por una potencia de 10).
 * @param {number} valor
 * @returns {number}
 */
function topeDelEje(valor) {
  if (valor <= 0) return 1;
  const potencia = 10 ** Math.floor(Math.log10(valor));
  const tope = [1, 2, 5, 10].find((paso) => paso * potencia >= valor);
  return tope * potencia;
}

/**
 * Calcula cuánto correr el tooltip hacia la izquierda (en % de su ancho) para que no se salga de la
 * tarjeta: en el primer cuarto del gráfico no se corre, en el centro se centra sobre la columna y
 * en el último cuarto queda entero a la izquierda.
 * @param {number} posicion Posición de la columna, de 0 (izquierda) a 1 (derecha).
 * @returns {number} Entre 0 y 100.
 */
function desplazamientoTooltip(posicion) {
  const proporcion = posicion * 2 - 0.5;
  return Math.min(1, Math.max(0, proporcion)) * 100;
}

/**
 * Gráfico de columnas con el TPV de cada día o semana del período. Cada columna es un botón: al
 * pasar el mouse o llegar con Tab muestra el detalle (fecha, TPV y cantidad de pedidos), y los
 * lectores de pantalla leen ese mismo detalle en su `aria-label`.
 * @param {object} props
 * @param {{ inicio: string, tpv: number, tpn: number }[]} props.puntos De lo más viejo a lo más nuevo.
 * @param {"dia" | "semana"} props.agrupacion
 * @returns {JSX.Element}
 */
export function GraficoEvolucionVentas({ puntos, agrupacion }) {
  const [indiceActivo, setIndiceActivo] = useState(null);
  const tope = topeDelEje(Math.max(...puntos.map((punto) => punto.tpv)));
  const cadaCuanto = Math.ceil(puntos.length / ETIQUETAS_EJE_X);
  const activo = indiceActivo === null ? null : puntos[indiceActivo];
  const posicionActiva = indiceActivo === null ? 0 : (indiceActivo + 0.5) / puntos.length;

  /**
   * @param {{ inicio: string }} punto
   * @returns {string} Ej. "24/11" o "Semana del 17/11".
   */
  const nombrePunto = (punto) =>
    agrupacion === "dia"
      ? formatearDiaCorto(punto.inicio)
      : `Semana del ${formatearDiaCorto(punto.inicio)}`;

  /**
   * @param {{ tpn: number }} punto
   * @returns {string} Ej. "1 pedido" o "3 pedidos".
   */
  const textoPedidos = (punto) => `${punto.tpn} ${punto.tpn === 1 ? "pedido" : "pedidos"}`;

  return (
    <div className="grafico-evolucion">
      {/* Eje vertical: tope, mitad y cero, con su línea de guía */}
      <div className="grafico-evolucion-guias" aria-hidden="true">
        {[tope, tope / 2, 0].map((valor) => (
          <div key={valor} className="grafico-evolucion-guia">
            <span>{formatearMontoCorto(valor)}</span>
          </div>
        ))}
      </div>

      <div
        className="grafico-evolucion-columnas"
        role="group"
        aria-label={`TPV por ${agrupacion === "dia" ? "día" : "semana"}`}
        onMouseLeave={() => setIndiceActivo(null)}
      >
        {puntos.map((punto, indice) => (
          <button
            key={punto.inicio}
            type="button"
            className={`grafico-evolucion-columna ${indice === indiceActivo ? "grafico-evolucion-columna-activa" : ""}`}
            aria-label={`${nombrePunto(punto)}: ${formatearPrecio(punto.tpv)}, ${textoPedidos(punto)}`}
            onMouseEnter={() => setIndiceActivo(indice)}
            onFocus={() => setIndiceActivo(indice)}
            onBlur={() => setIndiceActivo(null)}
          >
            <span
              className="grafico-evolucion-barra"
              style={{ height: `${(punto.tpv / tope) * 100}%` }}
            />
          </button>
        ))}

        {activo && (
          <div
            className="grafico-evolucion-tooltip"
            aria-hidden="true"
            style={{
              left: `${posicionActiva * 100}%`,
              transform: `translateX(-${desplazamientoTooltip(posicionActiva)}%)`,
            }}
          >
            <strong className="d-block">{nombrePunto(activo)}</strong>
            {formatearPrecio(activo.tpv)}
            <span className="text-secondary"> · {textoPedidos(activo)}</span>
          </div>
        )}
      </div>

      <div className="grafico-evolucion-eje-x" aria-hidden="true">
        {puntos.map((punto, indice) => (
          <span key={punto.inicio}>
            {indice % cadaCuanto === 0 ? formatearDiaCorto(punto.inicio) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
