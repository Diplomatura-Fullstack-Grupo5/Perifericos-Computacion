import { Fragment, useState } from "react";
import { Link } from "react-router";
import { DetalleProducto } from "./DetalleProducto";
import { LIMITE_STOCK_BAJO } from "../services/productosService";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./TablaProductos.css";

/**
 * Devuelve las clases del indicador de stock: rojo si no hay, amarillo si queda poco.
 * @param {number} stock
 * @returns {string}
 */
function clasesStock(stock) {
  if (stock <= 0) return "text-bg-danger";
  if (stock <= LIMITE_STOCK_BAJO) return "text-bg-warning";
  return "text-bg-light";
}

/** Próximo orden al hacer clic en "Stock": menor primero → mayor primero → sin orden. */
const SIGUIENTE_ORDEN = { "": "stock_asc", stock_asc: "stock_desc", stock_desc: "" };

/** Valor de `aria-sort` e ícono para cada orden de la columna Stock. */
const INDICADOR_ORDEN = {
  "": { ariaSort: "none", icono: "bi-arrow-down-up", texto: "Ordenar por stock, de menor a mayor" },
  stock_asc: { ariaSort: "ascending", icono: "bi-sort-numeric-down", texto: "Ordenar por stock, de mayor a menor" },
  stock_desc: { ariaSort: "descending", icono: "bi-sort-numeric-up-alt", texto: "Quitar el orden por stock" },
};

/**
 * Tabla de productos del panel, con las acciones de editar y eliminar en cada fila.
 * La columna Stock se ordena con un clic en su encabezado. Un clic en el nombre de un producto
 * abre (o cierra) debajo una fila con toda su información.
 * @param {object} props
 * @param {object[]} props.productos
 * @param {Object<string, Object<string, object>>} props.definiciones Definiciones de specs por categoría.
 * @param {"stock_asc" | "stock_desc" | ""} props.orden Orden actual.
 * @param {(orden: string) => void} props.onOrdenar Recibe el orden nuevo al hacer clic en "Stock".
 * @param {(producto: object) => void} props.onEliminar Se llama al pedir eliminar un producto.
 * @returns {JSX.Element}
 */
export function TablaProductos({ productos, definiciones, orden, onOrdenar, onEliminar }) {
  const [idExpandido, setIdExpandido] = useState(null);
  const indicador = INDICADOR_ORDEN[orden] ?? INDICADOR_ORDEN[""];

  function alternarDetalle(id) {
    setIdExpandido(idExpandido === id ? null : id);
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-responsive">
        <table className="table align-middle mb-0 tabla-productos-admin">
          <thead className="table-light tabla-panel__encabezado">
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col" className="text-end">
                Precio
              </th>
              <th scope="col" className="text-end" aria-sort={indicador.ariaSort}>
                <button
                  type="button"
                  className="btn btn-link p-0 text-reset text-decoration-none text-nowrap tabla-productos-admin__ordenar"
                  title={indicador.texto}
                  onClick={() => onOrdenar(SIGUIENTE_ORDEN[orden] ?? "stock_asc")}
                >
                  Stock
                  <i
                    className={`bi ${indicador.icono} ms-1 ${orden ? "text-primary" : "text-secondary"}`}
                    aria-hidden="true"
                  />
                </button>
              </th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const expandido = producto.id === idExpandido;
              const idDetalle = `detalle-producto-${producto.id}`;

              return (
                <Fragment key={producto.id}>
                  <tr className={expandido ? "table-active" : undefined}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={producto.image}
                          alt=""
                          className="tabla-productos-admin__imagen"
                          loading="lazy"
                        />
                        <div>
                          <button
                            type="button"
                            className="btn btn-link p-0 text-start text-body fw-semibold tabla-productos-admin__nombre"
                            aria-expanded={expandido}
                            aria-controls={idDetalle}
                            onClick={() => alternarDetalle(producto.id)}
                          >
                            {producto.name}
                            <i
                              className={`bi ${expandido ? "bi-chevron-up" : "bi-chevron-down"} ms-2 small text-secondary`}
                              aria-hidden="true"
                            />
                          </button>
                          <div className="small text-secondary">{producto.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td>{producto.category}</td>
                    <td className="text-end text-nowrap">{formatearPrecio(producto.price)}</td>
                    <td className="text-end">
                      <span className={`badge ${clasesStock(producto.stock)}`}>{producto.stock}</span>
                    </td>
                    <td className="text-end text-nowrap">
                      <Link
                        to={`/admin/productos/${producto.id}/editar`}
                        className="btn btn-sm btn-link tabla-productos-admin__accion"
                        title="Editar"
                        aria-label={`Editar ${producto.name}`}
                      >
                        <i className="bi bi-pencil" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-link tabla-productos-admin__accion tabla-productos-admin__accion--eliminar"
                        title="Eliminar"
                        aria-label={`Eliminar ${producto.name}`}
                        onClick={() => onEliminar(producto)}
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  {expandido && (
                    <tr id={idDetalle}>
                      <td colSpan={5} className="bg-body-tertiary px-4 py-3">
                        <DetalleProducto
                          producto={producto}
                          definiciones={definiciones[producto.category]}
                        />
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
