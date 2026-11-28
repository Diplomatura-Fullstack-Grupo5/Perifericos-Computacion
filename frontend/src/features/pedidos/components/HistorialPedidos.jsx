import { useEffect, useState } from "react";
import { DetallePedido } from "./DetallePedido";
import { obtenerPedidosUsuario } from "../services/pedidosService";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearEstadoPedido } from "../utils/formatearEstadoPedido";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { Spinner } from "../../../shared/components/atoms/Spinner";

/**
 * Muestra los pedidos vinculados al id del usuario.
 * @param {{ userId: number }} props
 * @returns {JSX.Element}
 */
export function HistorialPedidos({ userId }) {
  const [resultado, setResultado] = useState({ cargando: true, pedidos: [], error: null });

  useEffect(() => {
    let ignoreResponse = false;

    obtenerPedidosUsuario(userId)
      .then((pedidos) => {
        if (!ignoreResponse) setResultado({ cargando: false, pedidos, error: null });
      })
      .catch((error) => {
        console.error("Error al cargar el historial de pedidos:", error);
        if (!ignoreResponse) {
          setResultado({ cargando: false, pedidos: [], error: "No se pudo cargar tu historial." });
        }
      });

    return () => {
      ignoreResponse = true;
    };
  }, [userId]);

  if (resultado.cargando) return <Spinner texto="Cargando tus pedidos..." />;
  if (resultado.error) return <div className="alert alert-danger" role="alert">{resultado.error}</div>;
  if (resultado.pedidos.length === 0) {
    return <MensajeVacio>Todavía no hay pedidos vinculados a tu cuenta.</MensajeVacio>;
  }

  return (
    <div className="d-grid gap-3">
      {resultado.pedidos.map((pedido) => {
        const estado = formatearEstadoPedido(pedido.status);
        return (
          <details className="card" key={pedido.id}>
            <summary className="card-header d-flex justify-content-between align-items-center">
              <strong>Pedido #{pedido.id}</strong>
              <span className="d-flex align-items-center gap-3">
                <span className={`badge ${estado.clases}`}>{estado.texto}</span>
                <strong>{formatearPrecio(pedido.total)}</strong>
              </span>
            </summary>
            <div className="card-body">
              <DetallePedido pedido={pedido} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
