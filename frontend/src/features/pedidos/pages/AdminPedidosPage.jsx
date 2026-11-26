import { useEffect, useId, useState } from "react";
import { useSearchParams } from "react-router";
import {
  cambiarEstadoPedido,
  ESTADOS_PEDIDO,
  MEDIOS_DE_PAGO,
  obtenerPedidos,
} from "../services/pedidosService";
import { TablaPedidos } from "../components/TablaPedidos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";
import { formatearEstadoPedido } from "../../../shared/utils/formatearEstadoPedido";

/** Cantidad de pedidos que se muestran al principio y que se suman con "Mostrar más". */
const PEDIDOS_POR_TANDA = 20;

/** Textos del modal que confirma cada cambio de estado. */
const CONFIRMACIONES = {
  enviado: {
    titulo: "Marcar como enviado",
    textoConfirmar: "Marcar enviado",
    claseConfirmar: "btn-primary",
  },
  entregado: {
    titulo: "Marcar como entregado",
    textoConfirmar: "Marcar entregado",
    claseConfirmar: "btn-success",
  },
  cancelado: {
    titulo: "Cancelar pedido",
    textoConfirmar: "Cancelar pedido",
    claseConfirmar: "btn-danger",
  },
};

/**
 * Gestión de pedidos del panel de administración: búsqueda por cliente o número, filtros por estado
 * y medio de pago (en la URL: `?busqueda=&estado=&pago=`), detalle de cada pedido y cambio de estado
 * (con confirmación, porque un pedido no vuelve a un estado anterior).
 * @returns {JSX.Element}
 */
export function AdminPedidosPage() {
  const idBase = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get("busqueda") ?? "";
  const estado = searchParams.get("estado") ?? "";
  const pago = searchParams.get("pago") ?? "";
  const clave = searchParams.toString();

  const [resultado, setResultado] = useState({
    clave: null,
    pedidos: [],
    total: 0,
    porEstado: {},
    error: null,
  });
  const [cantidadVisible, setCantidadVisible] = useState(PEDIDOS_POR_TANDA);
  const [cambio, setCambio] = useState(null);
  const [idGuardando, setIdGuardando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cargando = resultado.clave !== clave;
  const { pedidos, total, porEstado, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;

    obtenerPedidos({ busqueda, estado, pago })
      .then(({ pedidos, total, porEstado }) => {
        if (!ignoreResponse) setResultado({ clave, pedidos, total, porEstado, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener los pedidos:", err);
        setResultado({
          clave,
          pedidos: [],
          total: 0,
          porEstado: {},
          error: "No se pudieron cargar los pedidos. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [clave, busqueda, estado, pago]);

  /**
   * Cambia un filtro en la URL y vuelve a mostrar la primera tanda de pedidos. Sin valor, quita el
   * filtro. Reemplaza la entrada del historial para no llenarlo con cada letra de la búsqueda.
   * @param {string} nombre
   * @param {string} valor
   */
  function cambiarFiltro(nombre, valor) {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(nombre, valor);
    else params.delete(nombre);
    setSearchParams(params, { replace: true });
    setCantidadVisible(PEDIDOS_POR_TANDA);
  }

  /**
   * Guarda el cambio de estado confirmado en el modal y actualiza la fila y los contadores sin volver
   * a pedir la lista (el pedido queda visible aunque ya no coincida con el filtro de estado).
   */
  async function handleConfirmarCambio() {
    const { pedido, estado: estadoNuevo } = cambio;
    setCambio(null);
    setIdGuardando(pedido.id);
    try {
      const actualizado = await cambiarEstadoPedido(pedido, estadoNuevo);
      setResultado({
        ...resultado,
        pedidos: pedidos.map((p) => (p.id === actualizado.id ? actualizado : p)),
        porEstado: {
          ...porEstado,
          [pedido.status]: porEstado[pedido.status] - 1,
          [estadoNuevo]: porEstado[estadoNuevo] + 1,
        },
      });
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
        <div className={`alert alert-${aviso.tipo} d-flex align-items-start`} role="status">
          <span className="flex-grow-1">{aviso.texto}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setAviso(null)}
          />
        </div>
      )}

      {/* -------------------- Búsqueda y filtros -------------------- */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <label htmlFor={`${idBase}-busqueda`} className="visually-hidden">
            Buscar por cliente o número de pedido
          </label>
          <input
            id={`${idBase}-busqueda`}
            type="search"
            className="form-control"
            placeholder="Buscar por cliente o número de pedido"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-sm-6 col-md-3">
          <label htmlFor={`${idBase}-estado`} className="visually-hidden">
            Estado
          </label>
          <select
            id={`${idBase}-estado`}
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
          <label htmlFor={`${idBase}-pago`} className="visually-hidden">
            Medio de pago
          </label>
          <select
            id={`${idBase}-pago`}
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

      {/* -------------------- Resultados -------------------- */}
      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {pedidos.length} de {total} pedidos
          </p>
          {pedidos.length === 0 ? (
            <MensajeVacio>No hay pedidos que coincidan con la búsqueda.</MensajeVacio>
          ) : (
            <>
              <TablaPedidos
                pedidos={pedidos.slice(0, cantidadVisible)}
                idGuardando={idGuardando}
                onCambiarEstado={(pedido, estadoNuevo) => setCambio({ pedido, estado: estadoNuevo })}
              />
              {cantidadVisible < pedidos.length && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setCantidadVisible(cantidadVisible + PEDIDOS_POR_TANDA)}
                  >
                    Mostrar más ({pedidos.length - cantidadVisible} restantes)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      <ModalConfirmacion
        abierto={cambio !== null}
        titulo={confirmacion?.titulo ?? ""}
        textoConfirmar={confirmacion?.textoConfirmar}
        claseConfirmar={confirmacion?.claseConfirmar}
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
