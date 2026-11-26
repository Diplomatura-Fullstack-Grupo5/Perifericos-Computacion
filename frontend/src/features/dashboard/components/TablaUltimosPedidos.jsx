import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/** Texto y color de cada estado de pedido. */
const ESTADOS = {
  pendiente: { texto: "Pendiente", clases: "text-bg-warning" },
  enviado: { texto: "Enviado", clases: "text-bg-primary" },
  entregado: { texto: "Entregado", clases: "text-bg-success" },
  cancelado: { texto: "Cancelado", clases: "text-bg-secondary" },
};

const formatoFecha = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

/**
 * Tabla con los pedidos más recientes: número, cliente, fecha, estado y total.
 * @param {object} props
 * @param {object[]} props.pedidos Del más nuevo al más viejo.
 * @returns {JSX.Element}
 */
export function TablaUltimosPedidos({ pedidos }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="ps-3">Pedido</th>
            <th scope="col">Cliente</th>
            <th scope="col">Fecha</th>
            <th scope="col">Estado</th>
            <th scope="col" className="text-end pe-3">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => {
            const estado = ESTADOS[pedido.status] ?? { texto: pedido.status, clases: "text-bg-light" };
            return (
              <tr key={pedido.id}>
                <td className="ps-3">#{pedido.id}</td>
                <td>{pedido.customer}</td>
                <td>
                  <time dateTime={pedido.createdAt}>
                    {formatoFecha.format(new Date(pedido.createdAt))}
                  </time>
                </td>
                <td>
                  <span className={`badge ${estado.clases}`}>{estado.texto}</span>
                </td>
                <td className="text-end text-nowrap pe-3">{formatearPrecio(pedido.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
