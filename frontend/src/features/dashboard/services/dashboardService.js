import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/** Con esta cantidad de unidades o menos, un producto entra en las alertas de stock bajo. */
const LIMITE_STOCK_BAJO = 5;

/** Cantidad de semanas del gráfico de ventas. */
const SEMANAS_VENTAS = 8;

/** Cantidad de elementos de las listas "Más comparados" y "Últimos pedidos". */
const LIMITE_LISTAS = 5;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * Devuelve el lunes (a las 0 h, hora local) de la semana de una fecha.
 * @param {Date} fecha
 * @returns {Date}
 */
function inicioDeSemana(fecha) {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const diasDesdeLunes = (lunes.getDay() + 6) % 7;
  lunes.setDate(lunes.getDate() - diasDesdeLunes);
  return lunes;
}

/**
 * Convierte una fecha en `"AAAA-MM-DD"` según la hora local (sin pasar a UTC, que puede cambiar el día).
 * @param {Date} fecha
 * @returns {string}
 */
function formatearDia(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/**
 * Suma las ventas de cada una de las últimas semanas, de la más vieja a la más nueva. Las semanas
 * terminan en la del pedido más reciente (y no en la de hoy) para que los datos de práctica, que
 * tienen fechas fijas, no queden fuera del gráfico con el paso del tiempo.
 * @param {object[]} pedidos Pedidos no cancelados.
 * @returns {{ inicio: string, total: number }[]} `inicio` es el lunes de la semana (`"AAAA-MM-DD"`).
 */
function calcularVentasPorSemana(pedidos) {
  if (pedidos.length === 0) return [];

  const masReciente = Math.max(...pedidos.map((pedido) => new Date(pedido.createdAt).getTime()));
  const ultimaSemana = inicioDeSemana(new Date(masReciente));

  const semanas = Array.from({ length: SEMANAS_VENTAS }, (_, i) => {
    const inicio = new Date(ultimaSemana);
    inicio.setDate(inicio.getDate() - 7 * (SEMANAS_VENTAS - 1 - i));
    return { inicio, total: 0 };
  });

  pedidos.forEach((pedido) => {
    const inicio = inicioDeSemana(new Date(pedido.createdAt));
    const semana = semanas.find((s) => Math.abs(s.inicio - inicio) < MS_POR_DIA);
    if (semana) semana.total += pedido.total;
  });

  return semanas.map(({ inicio, total }) => ({ inicio: formatearDia(inicio), total }));
}

/**
 * Obtiene las métricas del panel de administración. Simula `GET /api/admin/dashboard`: los cálculos
 * se hacen acá y no en los componentes porque, con el backend, los hará el servidor.
 * Los pedidos cancelados no cuentan para las ventas ni para el ticket promedio.
 * @returns {Promise<{
 *   indicadores: { ventas: number, pedidos: number, ticketPromedio: number, pendientes: number },
 *   ventasPorSemana: { inicio: string, total: number }[],
 *   masComparados: object[],
 *   stockBajo: object[],
 *   ultimosPedidos: object[],
 * }>}
 */
export async function obtenerDashboard() {
  const [pedidos, productos] = await Promise.all([
    pedir(ENDPOINTS.pedidos),
    pedir(ENDPOINTS.productos),
  ]);

  const pedidosValidos = pedidos.filter((pedido) => pedido.status !== "cancelado");
  const ventas = pedidosValidos.reduce((suma, pedido) => suma + pedido.total, 0);

  return {
    indicadores: {
      ventas,
      pedidos: pedidosValidos.length,
      ticketPromedio: pedidosValidos.length ? Math.round(ventas / pedidosValidos.length) : 0,
      pendientes: pedidos.filter((pedido) => pedido.status === "pendiente").length,
    },
    ventasPorSemana: calcularVentasPorSemana(pedidosValidos),
    masComparados: [...productos]
      .sort((a, b) => b.compared - a.compared)
      .slice(0, LIMITE_LISTAS),
    stockBajo: productos
      .filter((producto) => producto.stock <= LIMITE_STOCK_BAJO)
      .sort((a, b) => a.stock - b.stock),
    ultimosPedidos: [...pedidos]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, LIMITE_LISTAS),
  };
}
