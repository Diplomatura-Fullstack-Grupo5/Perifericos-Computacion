import { BadgeEstado } from "./BadgeEstado";
import { formatearPorcentaje } from "../utils/formatos";
import "./ResumenEstados.css";

/**
 * Cantidad de pedidos del período en cada estado, con su porcentaje sobre el total.
 * @param {object} props
 * @param {{ estado: string, cantidad: number }[]} props.estados En el orden en que avanza un pedido.
 * @returns {JSX.Element}
 */
export function ResumenEstados({ estados }) {
  const total = estados.reduce((suma, { cantidad }) => suma + cantidad, 0);

  return (
    <ul className="list-group list-group-flush">
      {estados.map(({ estado, cantidad }) => (
        <li key={estado} className="list-group-item d-flex align-items-center gap-2">
          <span className="flex-grow-1">
            <BadgeEstado estado={estado} />
          </span>
          <strong>{cantidad}</strong>
          <span className="small text-secondary text-end resumen-estados__porcentaje">
            {formatearPorcentaje(total ? (cantidad / total) * 100 : 0)}
          </span>
        </li>
      ))}
    </ul>
  );
}
