import { useEffect, useState } from "react";
import {
  cambiarEstadoPedido,
  ESTADOS_PEDIDO,
  MEDIOS_DE_PAGO,
  obtenerPedidos,
  PEDIDOS_POR_PAGINA,
} from "../services/pedidosService";
import { formatearEstadoPedido } from "../utils/formatearEstadoPedido";
import { TablaPedidos } from "../components/TablaPedidos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { Aviso } from "../../../shared/components/molecules/Aviso";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { Paginacion } from "../../../shared/components/molecules/Paginacion";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";
import { useFiltrosUrl } from "../../../shared/hooks/useFiltrosUrl";

/** Textos y color del botón del modal que confirma cada cambio de estado. */
const CONFIRMACIONES = {
  enviado: { titulo: "Marcar como enviado", boton: "Marcar enviado", clase: "btn-primary" },
  entregado: { titulo: "Marcar como entregado", boton: "Marcar entregado", clase: "btn-success" },
  cancelado: { titulo: "Cancelar pedido", boton: "Cancelar pedido", clase: "btn-danger" },
};

/**
 * Gestión de pedidos del panel: búsqueda por cliente o número, filtros por estado y medio de pago
 * (en la URL: `?busqueda=&estado=&pago=&pagina=`), detalle de cada pedido y cambio de estado con
 * confirmación, porque un pedido no vuelve a un estado anterior.
 * @returns {JSX.Element}
 */
export function AdminPedidosPage() {
  const { searchParams, consulta, cambiarFiltro, cambiarPagina } = useFiltrosUrl();
  const busqueda = searchParams.get("busqueda") ?? "";
  const estado = searchParams.get("estado") ?? "";
  const pago = searchParams.get("pago") ?? "";
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);

  const [resultado, setResultado] = useState({
    consulta: null,
    pedidos: [],
    total: 0,
    porEstado: {},
    error: null,
  });
  const [cambio, setCambio] = useState(null);
  const [idGuardando, setIdGuardando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cargando = resultado.consulta !== consulta;
  const { pedidos, total, porEstado, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;
    const timer = setTimeout(() => {
      obtenerPedidos({ busqueda, estado, pago, pagina })
        .then((datos) => {
          if (!ignoreResponse) setResultado({ consulta, ...datos, error: null });
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los pedidos:", err);
          setResultado({
            consulta,
            pedidos: [],
            total: 0,
            porEstado: {},
            error: "No se pudieron cargar los pedidos. Por favor, intentá de nuevo.",
          });
        });
    }, 300);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [consulta, busqueda, estado, pago, pagina]);

  function irAPagina(numero) {
    cambiarPagina(numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Guarda el cambio de estado confirmado y actualiza la fila y los contadores sin volver a pedir la
   * lista (el pedido queda visible aunque ya no coincida con el filtro de estado).
   */
  async function handleConfirmarCambio() {
    const { pedido, estado: estadoNuevo } = cambio;
    setCambio(null);
    setIdGuardando(pedido.id);
    try {
      const actualizado = await cambiarEstadoPedido(pedido, estadoNuevo);
      setResultado((prev) => ({
        ...prev,
        pedidos: prev.pedidos.map((p) => (p.id === actualizado.id ? actualizado : p)),
        porEstado: {
          ...prev.porEstado,
          [pedido.status]: prev.porEstado[pedido.status] - 1,
          [estadoNuevo]: prev.porEstado[estadoNuevo] + 1,
        },
      }));
      setAviso({
        tipo: "success",
        texto: `El pedido #${pedido.id} quedó ${formatearEstadoPedido(estadoNuevo).texto.toLowerCase()}.`,
      });
    } catch (err) {
      console.error("Error al cambiar el estado del pedido:", err);
      setAviso({
        tipo: "danger",
        texto: `No se pudo cambiar el estado del pedido #${pedido.id}. Por favor, intentá de nuevo.`,
      });
    } finally {
      setIdGuardando(null);
    }
  }

  const confirmacion = cambio ? CONFIRMACIONES[cambio.estado] : null;

  return (
    <>
      <h1 className="fs-3 mb-3">Pedidos</h1>

      {aviso && (
        <Aviso tipo={aviso.tipo} onCerrar={() => setAviso(null)}>
          {aviso.texto}
        </Aviso>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <label htmlFor="pedidos-busqueda" className="visually-hidden">
            Buscar por cliente o número de pedido
          </label>
          <input
            id="pedidos-busqueda"
            type="search"
            className="form-control"
            placeholder="Buscar por cliente o número de pedido"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-sm-6 col-md-3">
          <label htmlFor="pedidos-estado" className="visually-hidden">
            Estado
          </label>
          <select
            id="pedidos-estado"
            className="form-select"
            value={estado}
            onChange={(e) => cambiarFiltro("estado", e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_PEDIDO.map((nombre) => (
              <option key={nombre} value={nombre}>
                {formatearEstadoPedido(nombre).texto}
                {nombre in porEstado ? ` (${porEstado[nombre]})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-6 col-md-3">
          <label htmlFor="pedidos-pago" className="visually-hidden">
            Medio de pago
          </label>
          <select
            id="pedidos-pago"
            className="form-select"
            value={pago}
            onChange={(e) => cambiarFiltro("pago", e.target.value)}
          >
            <option value="">Todos los medios de pago</option>
            {MEDIOS_DE_PAGO.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {total} {total === 1 ? "pedido" : "pedidos"}
          </p>
          {pedidos.length === 0 ? (
            <MensajeVacio>No hay pedidos que coincidan con la búsqueda.</MensajeVacio>
          ) : (
            <>
              <TablaPedidos
                pedidos={pedidos}
                idGuardando={idGuardando}
                onCambiarEstado={(pedido, estadoNuevo) => setCambio({ pedido, estado: estadoNuevo })}
              />
              <Paginacion
                paginaActual={pagina}
                totalPaginas={Math.ceil(total / PEDIDOS_POR_PAGINA)}
                onChange={irAPagina}
                etiqueta="Páginas de pedidos"
              />
            </>
          )}
        </>
      )}

      <ModalConfirmacion
        abierto={cambio !== null}
        titulo={confirmacion?.titulo ?? ""}
        textoConfirmar={confirmacion?.boton}
        claseConfirmar={confirmacion?.clase}
        textoCancelar="Volver"
        onConfirmar={handleConfirmarCambio}
        onCancelar={() => setCambio(null)}
      >
        ¿Pasar el pedido <strong>#{cambio?.pedido.id}</strong> de {cambio?.pedido.customer} a{" "}
        <strong>{cambio && formatearEstadoPedido(cambio.estado).texto.toLowerCase()}</strong>? Después no
        se puede volver al estado anterior.
      </ModalConfirmacion>
    </>
  );
}
