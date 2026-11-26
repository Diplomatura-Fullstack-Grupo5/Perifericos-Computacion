import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearPorcentaje } from "../utils/formatos";
import "./GraficoMediosDePago.css";

/**
 * Reparto del TPV por medio de pago: una barra apilada (100 %) y debajo la leyenda con el
 * porcentaje, el monto y la cantidad de pedidos de cada medio. El color de cada medio depende de
 * su posición en la lista (que viene en un orden fijo), no de cuánto vendió.
 * @param {object} props
 * @param {{ medio: string, tpv: number, tpn: number, porcentaje: number }[]} props.medios
 * @returns {JSX.Element}
 */
export function GraficoMediosDePago({ medios }) {
  return (
    <>
      <div className="medios-pago__barra mb-3" aria-hidden="true">
        {medios
          .filter((medio) => medio.porcentaje > 0)
          .map((medio) => (
            <span
              key={medio.medio}
              className={`medios-pago__segmento medios-pago--serie-${medios.indexOf(medio) + 1}`}
              style={{ width: `${medio.porcentaje}%` }}
            />
          ))}
      </div>

      <ul className="list-unstyled mb-0">
        {medios.map((medio, indice) => (
          <li key={medio.medio} className="d-flex align-items-start gap-2 small py-1">
            <span
              className={`medios-pago__muestra medios-pago--serie-${indice + 1}`}
              aria-hidden="true"
            />
            <span className="flex-grow-1">
              {medio.medio}
              <span className="d-block text-secondary">
                {medio.tpn} {medio.tpn === 1 ? "pedido" : "pedidos"}
              </span>
            </span>
            <span className="text-end text-nowrap">
              <strong>{formatearPorcentaje(medio.porcentaje)}</strong>
              <span className="d-block text-secondary">{formatearPrecio(medio.tpv)}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
