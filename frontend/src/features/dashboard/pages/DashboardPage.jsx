import { useEffect, useState } from "react";
import { Link } from "react-router";
import { obtenerDashboard } from "../services/dashboardService";
import { TarjetaIndicador } from "../components/TarjetaIndicador";
import { GraficoVentasSemanales } from "../components/GraficoVentasSemanales";
import { ListaMasComparados } from "../components/ListaMasComparados";
import { ListaStockBajo } from "../components/ListaStockBajo";
import { TablaUltimosPedidos } from "../components/TablaUltimosPedidos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/**
 * Página de inicio del panel de administración: indicadores de ventas y pedidos, ventas por semana,
 * productos más comparados, alertas de stock bajo y últimos pedidos.
 * @returns {JSX.Element}
 */
export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignoreResponse = false;

    obtenerDashboard()
      .then((datos) => {
        if (!ignoreResponse) setDashboard(datos);
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener el dashboard:", err);
        setError("No se pudo cargar el dashboard. Por favor, intentá de nuevo.");
      });

    return () => {
      ignoreResponse = true;
    };
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!dashboard) return <Spinner />;

  const { indicadores, ventasPorSemana, masComparados, stockBajo, ultimosPedidos } = dashboard;

  return (
    <>
      <h1 className="fs-3 mb-3">Dashboard</h1>

      {/* -------------------- Indicadores -------------------- */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <TarjetaIndicador
            titulo="Ventas"
            valor={formatearPrecio(indicadores.ventas)}
            icono="cash-stack"
            detalle="Sin pedidos cancelados"
          />
        </div>
        <div className="col">
          <TarjetaIndicador titulo="Pedidos" valor={indicadores.pedidos} icono="bag-check" />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Ticket promedio"
            valor={formatearPrecio(indicadores.ticketPromedio)}
            icono="receipt"
          />
        </div>
        <div className="col">
          <TarjetaIndicador
            titulo="Pedidos pendientes"
            valor={indicadores.pendientes}
            icono="hourglass-split"
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* -------------------- Ventas por semana -------------------- */}
        <section className="col-lg-7" aria-labelledby="dashboard-ventas">
          <div className="card h-100">
            <div className="card-body">
              <h2 id="dashboard-ventas" className="fs-5 mb-3">
                Ventas por semana
              </h2>
              {ventasPorSemana.length === 0 ? (
                <MensajeVacio>Todavía no hay ventas.</MensajeVacio>
              ) : (
                <GraficoVentasSemanales semanas={ventasPorSemana} />
              )}
            </div>
          </div>
        </section>

        {/* -------------------- Más comparados -------------------- */}
        <section className="col-lg-5" aria-labelledby="dashboard-comparados">
          <div className="card h-100">
            <div className="card-body flex-grow-0 pb-0">
              <h2 id="dashboard-comparados" className="fs-5 mb-0">
                Más comparados
              </h2>
            </div>
            <ListaMasComparados productos={masComparados} />
          </div>
        </section>
      </div>

      <div className="row g-3 align-items-start">
        {/* -------------------- Últimos pedidos -------------------- */}
        <section className="col-lg-7" aria-labelledby="dashboard-pedidos">
          <div className="card overflow-hidden">
            <div className="card-body flex-grow-0">
              <h2 id="dashboard-pedidos" className="fs-5 mb-0">
                Últimos pedidos
              </h2>
            </div>
            {ultimosPedidos.length === 0 ? (
              <MensajeVacio>Todavía no hay pedidos.</MensajeVacio>
            ) : (
              <TablaUltimosPedidos pedidos={ultimosPedidos} />
            )}
          </div>
        </section>

        {/* -------------------- Stock bajo -------------------- */}
        <section className="col-lg-5" aria-labelledby="dashboard-stock">
          <div className="card">
            <div className="card-body flex-grow-0 pb-0 d-flex justify-content-between align-items-baseline gap-2">
              <h2 id="dashboard-stock" className="fs-5 mb-0">
                Stock bajo
                <span className="badge rounded-pill text-bg-light ms-2">{stockBajo.length}</span>
              </h2>
              <Link to="/admin/productos?orden=stock_asc" className="small">
                Ver productos
              </Link>
            </div>
            {stockBajo.length === 0 ? (
              <MensajeVacio>Todos los productos tienen stock suficiente.</MensajeVacio>
            ) : (
              <ListaStockBajo productos={stockBajo} />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
