import { pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";
import { ESTADOS_PEDIDO, MEDIOS_DE_PAGO } from "../../pedidos";
import { LIMITE_STOCK_BAJO } from "../../productos";

/** Períodos que se pueden elegir, en días. */
export const PERIODOS = [7, 30, 90];

/** Cantidad de productos de la lista de más vendidos. */
const LIMITE_LISTAS = 5;

/** Desde esta cantidad de días, la evolución de ventas se agrupa por semana en lugar de por día. */
const DIAS_AGRUPAR_POR_SEMANA = 60;

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
 * Devuelve una fecha nueva a las 0 h (hora local) del día de `fecha`, corrida `dias` días.
 * @param {Date} fecha
 * @param {number} [dias]
 * @returns {Date}
 */
function inicioDelDia(fecha, dias = 0) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
}

/**
 * Devuelve el lunes (a las 0 h, hora local) de la semana de una fecha.
 * @param {Date} fecha
 * @returns {Date}
 */
function inicioDeSemana(fecha) {
  return inicioDelDia(fecha, -((fecha.getDay() + 6) % 7));
}

/**
 * Calcula la variación porcentual entre dos valores.
 * @param {number} actual
 * @param {number} anterior
 * @returns {number | null} Ej. 12.5 = +12,5 %. `null` si no hay base para comparar.
 */
function variacion(actual, anterior) {
  return anterior ? ((actual - anterior) / anterior) * 100 : null;
}

/**
 * Calcula los totales de un conjunto de pedidos. Los cancelados no suman ventas.
 * @param {object[]} pedidos
 * @returns {{ tpv: number, tpn: number, ticketPromedio: number, unidades: number, tasaCancelacion: number }}
 */
function calcularTotales(pedidos) {
  const validos = pedidos.filter((pedido) => pedido.status !== "cancelado");
  const tpv = validos.reduce((suma, pedido) => suma + pedido.total, 0);
  const unidades = validos.reduce(
    (suma, pedido) => suma + pedido.items.reduce((s, item) => s + item.quantity, 0),
    0,
  );

  return {
    tpv,
    tpn: validos.length,
    ticketPromedio: validos.length ? Math.round(tpv / validos.length) : 0,
    unidades,
    tasaCancelacion: pedidos.length ? ((pedidos.length - validos.length) / pedidos.length) * 100 : 0,
  };
}

/**
 * Agrupa las ventas del período por día o por semana, de lo más viejo a lo más nuevo, incluyendo
 * los días (o semanas) sin ventas.
 * @param {object[]} validos Pedidos no cancelados del período.
 * @param {Date} desde Primer día del período (0 h).
 * @param {Date} hasta Día siguiente al último del período (0 h).
 * @param {"dia" | "semana"} agrupacion
 * @returns {{ inicio: string, tpv: number, tpn: number }[]} `inicio` = día o lunes (`"AAAA-MM-DD"`).
 */
function calcularEvolucion(validos, desde, hasta, agrupacion) {
  const porSemana = agrupacion === "semana";
  const inicioDelGrupo = (fecha) => formatearDia(porSemana ? inicioDeSemana(fecha) : fecha);

  const puntos = [];
  let fecha = porSemana ? inicioDeSemana(desde) : desde;
  while (fecha < hasta) {
    puntos.push({ inicio: formatearDia(fecha), tpv: 0, tpn: 0 });
    fecha = inicioDelDia(fecha, porSemana ? 7 : 1);
  }

  validos.forEach((pedido) => {
    const punto = puntos.find(({ inicio }) => inicio === inicioDelGrupo(new Date(pedido.createdAt)));
    if (!punto) return;
    punto.tpv += pedido.total;
    punto.tpn += 1;
  });

  return puntos;
}

/**
 * Busca un producto del catálogo por su id.
 * @param {object[]} productos
 * @param {number} id
 * @returns {object | undefined} `undefined` si el producto ya no existe.
 */
function buscarProducto(productos, id) {
  return productos.find((producto) => producto.id === id);
}

/**
 * Suma las ventas del período por categoría de producto, de mayor a menor.
 * @param {object[]} validos Pedidos no cancelados del período.
 * @param {object[]} productos
 * @returns {{ categoria: string, tpv: number, unidades: number, porcentaje: number }[]}
 */
function calcularPorCategoria(validos, productos) {
  const categorias = {};
  let total = 0;

  validos.forEach((pedido) =>
    pedido.items.forEach((item) => {
      // Un producto borrado del catálogo ya no tiene categoría.
      const categoria = buscarProducto(productos, item.productId)?.category ?? "Otros";
      const fila = categorias[categoria] ?? { categoria, tpv: 0, unidades: 0 };
      fila.tpv += item.price * item.quantity;
      fila.unidades += item.quantity;
      total += item.price * item.quantity;
      categorias[categoria] = fila;
    }),
  );

  return Object.values(categorias)
    .map((fila) => ({ ...fila, porcentaje: total ? (fila.tpv / total) * 100 : 0 }))
    .sort((a, b) => b.tpv - a.tpv);
}

/**
 * Suma las ventas del período por medio de pago, en el orden de `MEDIOS_DE_PAGO`.
 * @param {object[]} validos Pedidos no cancelados del período.
 * @returns {{ medio: string, tpv: number, tpn: number, porcentaje: number }[]}
 */
function calcularMediosDePago(validos) {
  const total = validos.reduce((suma, pedido) => suma + pedido.total, 0);

  return MEDIOS_DE_PAGO.map((medio) => {
    const delMedio = validos.filter((pedido) => pedido.paymentMethod === medio);
    const tpv = delMedio.reduce((suma, pedido) => suma + pedido.total, 0);
    return { medio, tpv, tpn: delMedio.length, porcentaje: total ? (tpv / total) * 100 : 0 };
  });
}

/**
 * Devuelve los productos con más unidades vendidas en el período.
 * @param {object[]} validos Pedidos no cancelados del período.
 * @param {object[]} productos
 * @returns {{ id: number, name: string, image?: string, category: string, unidades: number, tpv: number }[]}
 */
function calcularMasVendidos(validos, productos) {
  const vendidos = {};

  validos.forEach((pedido) =>
    pedido.items.forEach((item) => {
      const producto = buscarProducto(productos, item.productId);
      const fila = vendidos[item.productId] ?? {
        id: item.productId,
        name: item.name,
        image: producto?.image,
        category: producto?.category ?? "Otros",
        unidades: 0,
        tpv: 0,
      };
      fila.unidades += item.quantity;
      fila.tpv += item.price * item.quantity;
      vendidos[item.productId] = fila;
    }),
  );

  return Object.values(vendidos).sort((a, b) => b.unidades - a.unidades).slice(0, LIMITE_LISTAS);
}

/**
 * Obtiene las métricas del panel de administración para un período. Simula
 * `GET /api/admin/dashboard?dias=`: los cálculos se hacen acá y no en los componentes porque, con
 * el backend, los hará el servidor.
 *
 * - TPV (volumen total de pagos): suma de los pedidos no cancelados.
 * - TPN (número total de pagos): cantidad de pedidos no cancelados.
 * - Cada indicador se compara con el período anterior de la misma duración: en % los montos y
 *   cantidades, y en puntos porcentuales la tasa de cancelación.
 * - El período termina el día del pedido más reciente (y no hoy) para que los datos de práctica,
 *   que tienen fechas fijas, no queden fuera con el paso del tiempo.
 * @param {number} [dias] Duración del período (uno de `PERIODOS`).
 * @returns {Promise<object>} Ver la forma en el `return`.
 */
export async function obtenerDashboard(dias = 30) {
  const [pedidos, productos] = await Promise.all([
    pedir(ENDPOINTS.pedidos),
    pedir(ENDPOINTS.productos),
  ]);

  const masReciente = pedidos.length
    ? new Date(Math.max(...pedidos.map((pedido) => new Date(pedido.createdAt).getTime())))
    : new Date();
  const hasta = inicioDelDia(masReciente, 1);
  const desde = inicioDelDia(hasta, -dias);
  const desdeAnterior = inicioDelDia(desde, -dias);

  const entre = (inicio, fin) =>
    pedidos.filter((pedido) => {
      const fecha = new Date(pedido.createdAt);
      return fecha >= inicio && fecha < fin;
    });
  const delPeriodo = entre(desde, hasta);
  const validos = delPeriodo.filter((pedido) => pedido.status !== "cancelado");

  const actual = calcularTotales(delPeriodo);
  const anterior = calcularTotales(entre(desdeAnterior, desde));
  const indicadores = Object.fromEntries(
    Object.keys(actual).map((clave) => [
      clave,
      { valor: actual[clave], variacion: variacion(actual[clave], anterior[clave]) },
    ]),
  );
  // Una tasa se compara por diferencia (puntos porcentuales), no por variación relativa.
  indicadores.tasaCancelacion.variacion = actual.tasaCancelacion - anterior.tasaCancelacion;

  const agrupacion = dias >= DIAS_AGRUPAR_POR_SEMANA ? "semana" : "dia";

  return {
    periodo: { desde: formatearDia(desde), hasta: formatearDia(inicioDelDia(hasta, -1)), dias },
    indicadores,
    pendientes: pedidos.filter((pedido) => pedido.status === "pendiente").length,
    evolucion: { agrupacion, puntos: calcularEvolucion(validos, desde, hasta, agrupacion) },
    porCategoria: calcularPorCategoria(validos, productos),
    mediosDePago: calcularMediosDePago(validos),
    estados: ESTADOS_PEDIDO.map((estado) => ({
      estado,
      cantidad: delPeriodo.filter((pedido) => pedido.status === estado).length,
    })),
    masVendidos: calcularMasVendidos(validos, productos),
    stockBajo: productos
      .filter((producto) => producto.stock <= LIMITE_STOCK_BAJO)
      .sort((a, b) => a.stock - b.stock),
  };
}
