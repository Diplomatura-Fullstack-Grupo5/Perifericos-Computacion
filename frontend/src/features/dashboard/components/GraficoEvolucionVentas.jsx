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
 * Gráfico de columnas con el TPV de cada día o semana del período. Al pasar el mouse por una
 * columna muestra el detalle (fecha, TPV y cantidad de pedidos). Para lectores de pantalla, los
 * mismos datos van en una tabla oculta.
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
  const nombrePunto = (punto) =>
    agrupacion === "dia" ? formatearDiaCorto(punto.inicio) : `Semana del ${formatearDiaCorto(punto.inicio)}`;

  return (
    <>
      <div className="grafico-evolucion" aria-hidden="true">
        {/* Eje vertical: tope, mitad y cero, con su línea de guía */}
        <div className="grafico-evolucion__guias">
          {[tope, tope / 2, 0].map((valor) => (
            <div key={valor} className="grafico-evolucion__guia">
              <span>{formatearMontoCorto(valor)}</span>
            </div>
          ))}
        </div>

        <div className="grafico-evolucion__columnas" onMouseLeave={() => setIndiceActivo(null)}>
          {puntos.map((punto, indice) => (
            <div
              key={punto.inicio}
              className={`grafico-evolucion__columna ${indice === indiceActivo ? "is-activa" : ""}`}
              onMouseEnter={() => setIndiceActivo(indice)}
            >
              <span
                className="grafico-evolucion__barra"
                style={{ height: `${(punto.tpv / tope) * 100}%` }}
              />
            </div>
          ))}

          {activo && (
            <div
              className="grafico-evolucion__tooltip"
              style={{
                left: `${((indiceActivo + 0.5) / puntos.length) * 100}%`,
                // En los extremos se corre hacia adentro para no salirse de la tarjeta.
                transform: `translateX(${-100 * Math.min(1, Math.max(0, (indiceActivo + 0.5) / puntos.length * 2 - 0.5))}%)`,
              }}
            >
              <strong className="d-block">{nombrePunto(activo)}</strong>
              {formatearPrecio(activo.tpv)}
              <span className="text-secondary">
                {" "}
                · {activo.tpn} {activo.tpn === 1 ? "pedido" : "pedidos"}
              </span>
            </div>
          )}
        </div>

        <div className="grafico-evolucion__eje-x">
          {puntos.map((punto, indice) => (
            <span key={punto.inicio}>
              {indice % cadaCuanto === 0 ? formatearDiaCorto(punto.inicio) : ""}
            </span>
          ))}
        </div>
      </div>

      <table className="visually-hidden">
        <caption>TPV por {agrupacion === "dia" ? "día" : "semana"}</caption>
        <thead>
          <tr>
            <th scope="col">{agrupacion === "dia" ? "Día" : "Semana"}</th>
            <th scope="col">TPV</th>
            <th scope="col">Pedidos</th>
          </tr>
        </thead>
        <tbody>
          {puntos.map((punto) => (
            <tr key={punto.inicio}>
              <th scope="row">{nombrePunto(punto)}</th>
              <td>{formatearPrecio(punto.tpv)}</td>
              <td>{punto.tpn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
