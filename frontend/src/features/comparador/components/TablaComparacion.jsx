import { Link } from "react-router";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import { formatearValorSpec } from "../../../shared/utils/formatearValorSpec";
import "./TablaComparacion.css";

/**
 * Texto de una celda de la tabla.
 * @param {object} fila
 * @param {*} valor
 * @returns {string}
 */
function textoCelda(fila, valor) {
  if (valor === null) return "—";
  if (fila.key === "price") return formatearPrecio(valor);
  return formatearValorSpec(valor, fila.unit);
}

/**
 * Tabla lado a lado: una columna por producto y una fila por spec. Marca con borde amarillo las
 * filas donde los valores difieren y en verde con ★ el mejor valor de cada una.
 * @param {object} props
 * @param {object[]} props.productos Productos a comparar.
 * @param {ReturnType<typeof import("../utils/armarFilasComparacion").armarFilasComparacion>} props.filas
 *   Filas a mostrar (ya filtradas y recortadas).
 * @param {(id: number) => void} props.onQuitar Se llama al quitar un producto de la comparación.
 * @returns {JSX.Element}
 */
export function TablaComparacion({ productos, filas, onQuitar }) {
  return (
    <div className="table-responsive border rounded-3 bg-white">
      <table
        className="table mb-0 align-middle tabla-comparacion"
        style={{ minWidth: `${10 + productos.length * 12}rem` }}
      >
        {/* -------------------- Encabezado: un producto por columna -------------------- */}
        <thead>
          <tr>
            <th scope="col" className="tabla-comparacion-spec">
              <span className="visually-hidden">Especificación</span>
            </th>
            {productos.map((producto) => (
              <th key={producto.id} scope="col" className="tabla-comparacion-producto">
                <button
                  type="button"
                  className="btn-close tabla-comparacion-quitar"
                  aria-label={`Quitar ${producto.name} de la comparación`}
                  title="Quitar de la comparación"
                  onClick={() => onQuitar(producto.id)}
                />
                <Link
                  to={`/producto/${producto.id}`}
                  className="text-decoration-none text-body d-block"
                >
                  <div className="tabla-comparacion-imagen">
                    {producto.image && <img src={producto.image} alt="" loading="lazy" />}
                  </div>
                  <span className="d-block fw-semibold mt-2">{producto.name}</span>
                </Link>
                <span className="d-block text-primary fw-bold">
                  {formatearPrecio(producto.price)}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* -------------------- Filas de specs -------------------- */}
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.key}>
              <th scope="row" className="tabla-comparacion-spec">
                {fila.label}
              </th>
              {fila.valores.map((valor, i) => {
                const esMejor = fila.mejores.includes(i);
                const clases = [
                  fila.difieren && "tabla-comparacion-difiere",
                  esMejor && "tabla-comparacion-mejor",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <td key={productos[i].id} className={clases}>
                    {textoCelda(fila, valor)}
                    {esMejor && (
                      <span aria-label="mejor valor" title="Mejor valor">
                        {" "}★
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
