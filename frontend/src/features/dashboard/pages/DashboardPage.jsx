import { Fragment, useEffect, useId, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { obtenerDashboard, PERIODOS } from "../services/dashboardService";
import { SeccionDashboard } from "../components/SeccionDashboard";
import { TarjetaIndicador } from "../components/TarjetaIndicador";
import { GraficoEvolucionVentas } from "../components/GraficoEvolucionVentas";
import { GraficoBarrasHorizontales } from "../components/GraficoBarrasHorizontales";
import { GraficoMediosDePago } from "../components/GraficoMediosDePago";
import { ResumenEstados } from "../components/ResumenEstados";
import { ListaProductosDashboard } from "../components/ListaProductosDashboard";
import { TablaUltimosPedidos } from "../components/TablaUltimosPedidos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearMontoCorto, formatearPorcentaje } from "../utils/formatos";

/** Período que se muestra si la URL no indica otro. */
const PERIODO_INICIAL = 30;

const formatoFecha = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

/**
 * Convierte un día `"AAAA-MM-DD"` en un texto como "26 nov.", en hora local.
 * @param {string} dia
 * @returns {string}
 */
function formatearFecha(dia) {
  const [anio, mes, numero] = dia.split("-").map(Number);
  return formatoFecha.format(new Date(anio, mes - 1, numero));
}

/**
 * Página de inicio del panel de administración: indicadores del período elegido (TPV, TPN, ticket
 * promedio, unidades y cancelaciones, comparados con el período anterior), evolución de ventas,
 * ventas por categoría y por medio de pago, estado de los pedidos, más vendidos, stock bajo y
 * últimos pedidos. El período va en la URL (`?periodo=7|30|90`).
 * @returns {JSX.Element}
 */
export function DashboardPage() {
  const idBase = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const periodoUrl = Number(searchParams.get("periodo"));
  const periodo = PERIODOS.includes(periodoUrl) ? periodoUrl : PERIODO_INICIAL;

  const [resultado, setResultado] = useState({ periodo: null, dashboard: null, error: null });
  const cargando = resultado.periodo !== periodo;

  useEffect(() => {
    let ignoreResponse = false;

    obtenerDashboard(periodo)
      .then((dashboard) => {
        if (!ignoreResponse) setResultado({ periodo, dashboard, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener el dashboard:", err);
        setResultado({
          periodo,
          dashboard: null,
          error: "No se pudo cargar el dashboard. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [periodo]);

  /**
   * Cambia el período en la URL. Reemplaza la entrada del historial, como los filtros del panel.
   * @param {number} dias
   */
  function cambiarPeriodo(dias) {
    const params = new URLSearchParams(searchParams);
    if (dias === PERIODO_INICIAL) params.delete("periodo");
    else params.set("periodo", String(dias));
    setSearchParams(params, { replace: true });
  }

  const { dashboard, error } = resultado;

  const encabezado = (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 className="fs-3 mb-0">Dashboard</h1>
        {!cargando && dashboard && (
          <p className="small text-secondary mb-0">
            Del {formatearFecha(dashboard.periodo.desde)} al{" "}
            {formatearFecha(dashboard.periodo.hasta)}
          </p>
        )}
      </div>

      <div className="btn-group" role="group" aria-label="Período">
        {PERIODOS.map((dias) => (
          <Fragment key={dias}>
            <input
              type="radio"
              className="btn-check"
              name={`${idBase}-periodo`}
              id={`${idBase}-periodo-${dias}`}
              checked={periodo === dias}
              onChange={() => cambiarPeriodo(dias)}
            />
            <label className="btn btn-outline-primary btn-sm" htmlFor={`${idBase}-periodo-${dias}`}>
              {dias} días
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );

  if (cargando || error) {
    return (
      <>
        {encabezado}
        {cargando ? (
          <Spinner />
        ) : (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </>
    );
  }

  const {
    indicadores,
    pendientes,
    evolucion,
    porCategoria,
    mediosDePago,
    estados,
    masVendidos,
    stockBajo,
    ultimosPedidos,
  } = dashboard;
  const sinVentas = indicadores.tpn.valor === 0;

  return (
    <>
      {encabezado}

      {/* -------------------- Indicadores -------------------- */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 mb-4">
        <div className="col">
          <TarjetaIndicador
            titulo="TPV"
            descripcion="Volumen total de pagos"
            valor={formatearPrecio(indicadores.tpv.valor)}
            variacion={indicadores.tpv.variacion}
            icono="cash-stack"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="TPN"
            descripcion="Cantidad de pagos (pedidos)"
            valor={indicadores.tpn.valor}
            variacion={indicadores.tpn.variacion}
            icono="credit-card"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Ticket promedio"
            descripcion="TPV ÷ TPN"
            valor={formatearPrecio(indicadores.ticketPromedio.valor)}
            variacion={indicadores.ticketPromedio.variacion}
            icono="receipt"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Unidades vendidas"
            valor={indicadores.unidades.valor}
            variacion={indicadores.unidades.variacion}
            icono="box-seam"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Tasa de cancelación"
            descripcion="Pedidos cancelados del período"
            valor={formatearPorcentaje(indicadores.tasaCancelacion.valor)}
            variacion={indicadores.tasaCancelacion.variacion}
            mejorSiBaja
            variacionEnPuntos
            icono="x-circle"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Pedidos pendientes"
            descripcion="Por preparar (estado actual)"
            valor={pendientes}
            icono="hourglass-split"
          />
        </div>
      </div>

      {/* -------------------- Evolución y medios de pago -------------------- */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <SeccionDashboard
            titulo={`TPV por ${evolucion.agrupacion === "dia" ? "día" : "semana"}`}
          >
            {sinVentas ? (
              <MensajeVacio>No hubo ventas en el período.</MensajeVacio>
            ) : (
              <GraficoEvolucionVentas puntos={evolucion.puntos} agrupacion={evolucion.agrupacion} />
            )}
          </SeccionDashboard>
        </div>
        <div className="col-lg-4">
          <SeccionDashboard titulo="Medios de pago">
            {sinVentas ? (
              <MensajeVacio>No hubo ventas en el período.</MensajeVacio>
            ) : (
              <GraficoMediosDePago medios={mediosDePago} />
            )}
          </SeccionDashboard>
        </div>
      </div>

      {/* -------------------- Categorías, estados y más vendidos -------------------- */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <SeccionDashboard titulo="Ventas por categoría">
            {sinVentas ? (
              <MensajeVacio>No hubo ventas en el período.</MensajeVacio>
            ) : (
              <GraficoBarrasHorizontales
                filas={porCategoria.map((fila) => ({
                  clave: fila.categoria,
                  etiqueta: fila.categoria,
                  valor: fila.tpv,
                  texto: formatearMontoCorto(fila.tpv),
                  detalle: `${formatearPorcentaje(fila.porcentaje)} · ${fila.unidades} u.`,
                }))}
              />
            )}
          </SeccionDashboard>
        </div>
        <div className="col-lg-4">
          <SeccionDashboard titulo="Más vendidos" sinMargen>
            {masVendidos.length === 0 ? (
              <MensajeVacio>No hubo ventas en el período.</MensajeVacio>
            ) : (
              <ListaProductosDashboard
                numerada
                productos={masVendidos}
                enlace={(producto) => `/producto/${producto.id}`}
                dato={(producto) => (
                  <>
                    <strong>{producto.unidades}</strong> u.
                  </>
                )}
              />
            )}
          </SeccionDashboard>
        </div>
        <div className="col-lg-4">
          <SeccionDashboard titulo="Estado de los pedidos" sinMargen>
            <ResumenEstados estados={estados} />
          </SeccionDashboard>
        </div>
      </div>

      {/* -------------------- Últimos pedidos -------------------- */}
      <div className="mb-4">
        <SeccionDashboard titulo="Últimos pedidos" sinMargen>
          {ultimosPedidos.length === 0 ? (
            <MensajeVacio>Todavía no hay pedidos.</MensajeVacio>
          ) : (
            <TablaUltimosPedidos pedidos={ultimosPedidos} />
          )}
        </SeccionDashboard>
      </div>

      {/* -------------------- Stock bajo -------------------- */}
      <SeccionDashboard
        titulo={`Stock bajo (${stockBajo.length})`}
        sinMargen
        accion={
          <Link to="/admin/productos?orden=stock_asc" className="small">
            Ver productos
          </Link>
        }
      >
        {stockBajo.length === 0 ? (
          <MensajeVacio>Todos los productos tienen stock suficiente.</MensajeVacio>
        ) : (
          <ListaProductosDashboard
            productos={stockBajo}
            enlace={(producto) => `/admin/productos/${producto.id}/editar`}
            dato={(producto) => (
              <span
                className={`badge ${producto.stock <= 0 ? "text-bg-danger" : "text-bg-warning"}`}
              >
                {producto.stock <= 0 ? "Sin stock" : `${producto.stock} u.`}
              </span>
            )}
          />
        )}
      </SeccionDashboard>
    </>
  );
}
