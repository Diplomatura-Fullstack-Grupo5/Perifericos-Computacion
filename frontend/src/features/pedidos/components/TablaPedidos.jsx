import { Fragment, useId, useState } from "react";
import { DetallePedido } from "./DetallePedido";
import { obtenerEstadosSiguientes } from "../services/pedidosService";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearEstadoPedido } from "../../../shared/utils/formatearEstadoPedido";
import "./TablaPedidos.css";

const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });

/** Botón de cada estado al que se puede pasar un pedido. */
const ACCIONES_ESTADO = {
  enviado: { texto: "Marcar enviado", icono: "bi-truck", clases: "btn-outline-primary" },
  entregado: { texto: "Marcar entregado", icono: "bi-check2-circle", clases: "btn-outline-success" },
  cancelado: { texto: "Cancelar", icono: "bi-x-circle", clases: "btn-outline-danger" },
};

/** Cantidad de columnas de la tabla (para la fila del detalle). */
const COLUMNAS = 6;

/**
 * Tabla de pedidos del panel. Cada fila tiene los botones para pasar el pedido a los estados
 * permitidos. Un clic en el número de pedido abre (o cierra) debajo una fila con sus productos.
 * @param {object} props
 * @param {object[]} props.pedidos
 * @param {number | null} props.idGuardando Pedido cuyo cambio de estado se está guardando (sus
 *   botones quedan deshabilitados).
 * @param {(pedido: object, estado: string) => void} props.onCambiarEstado Se llama al pedir pasar un
 *   pedido a otro estado.
 * @returns {JSX.Element}
 */
export function TablaPedidos({ pedidos, idGuardando, onCambiarEstado }) {
  const idBase = useId();
  const [idExpandido, setIdExpandido] = useState(null);

  function alternarDetalle(id) {
    setIdExpandido(idExpandido === id ? null : id);
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-responsive">
        <table className="table align-middle mb-0 tabla-pedidos">
          <thead className="table-light tabla-panel__encabezado">
            <tr>
              <th scope="col">Pedido</th>
              <th scope="col">Cliente</th>
              <th scope="col">Medio de pago</th>
              <th scope="col" className="text-end">
                Total
              </th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const expandido = pedido.id === idExpandido;
              const idDetalle = `${idBase}-detalle-${pedido.id}`;
              const estado = formatearEstadoPedido(pedido.status);
              const siguientes = obtenerEstadosSiguientes(pedido.status);
              const cantidadProductos = pedido.items.reduce((suma, item) => suma + item.quantity, 0);

              return (
                <Fragment key={pedido.id}>
                  <tr className={expandido ? "table-active" : undefined}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-start text-body fw-semibold text-nowrap tabla-pedidos__numero"
                        aria-expanded={expandido}
                        aria-controls={idDetalle}
                        onClick={() => alternarDetalle(pedido.id)}
                      >
                        #{pedido.id}
                        <i
                          className={`bi ${expandido ? "bi-chevron-up" : "bi-chevron-down"} ms-2 small text-secondary`}
                          aria-hidden="true"
                        />
                      </button>
                      <div className="small text-secondary text-nowrap">
                        <time dateTime={pedido.createdAt}>
                          {formatoFecha.format(new Date(pedido.createdAt))}
                        </time>
                      </div>
                    </td>
                    <td className="text-nowrap">{pedido.customer}</td>
                    <td className="text-nowrap">{pedido.paymentMethod}</td>
                    <td className="text-end text-nowrap">
                      {formatearPrecio(pedido.total)}
                      <div className="small text-secondary">
                        {cantidadProductos} {cantidadProductos === 1 ? "producto" : "productos"}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${estado.clases}`}>{estado.texto}</span>
                    </td>
                    <td className="text-end text-nowrap">
                      {siguientes.length === 0 ? (
                        <span className="small text-secondary">Sin acciones</span>
                      ) : (
                        <div className="d-inline-flex gap-2">
                          {siguientes.map((siguiente) => {
                            const accion = ACCIONES_ESTADO[siguiente];
                            return (
                              <button
                                key={siguiente}
                                type="button"
                                className={`btn btn-sm ${accion.clases}`}
                                disabled={idGuardando === pedido.id}
                                aria-label={`${accion.texto} el pedido #${pedido.id}`}
                                onClick={() => onCambiarEstado(pedido, siguiente)}
                              >
                                <i className={`bi ${accion.icono} me-1`} aria-hidden="true" />
                                {accion.texto}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandido && (
                    <tr id={idDetalle}>
                      <td colSpan={COLUMNAS} className="bg-body-tertiary px-4 py-3">
                        <DetallePedido pedido={pedido} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
