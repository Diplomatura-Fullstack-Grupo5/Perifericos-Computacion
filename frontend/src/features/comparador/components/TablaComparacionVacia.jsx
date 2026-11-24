import { Link } from "react-router";
import "./TablaComparacion.css";

const COLUMNAS = 3;
const FILAS_DE_RELLENO = 4;

/**
 * Tabla de ejemplo para cuando no hay productos elegidos: columnas vacías que invitan a ir al
 * catálogo y filas grises de relleno, para mostrar cómo se va a ver la comparación.
 * @returns {JSX.Element}
 */
export function TablaComparacionVacia() {
  const columnas = Array.from({ length: COLUMNAS }, (_, i) => i);
  const filas = Array.from({ length: FILAS_DE_RELLENO }, (_, i) => i);

  return (
    <div className="table-responsive border rounded-3 bg-white">
      <table
        className="table mb-0 align-middle tabla-comparacion"
        style={{ minWidth: `${10 + COLUMNAS * 12}rem` }}
      >
        <thead>
          <tr>
            <th scope="col" className="tabla-comparacion-spec">
              <span className="visually-hidden">Especificación</span>
            </th>
            {columnas.map((columna) => (
              <th key={columna} scope="col" className="tabla-comparacion-producto">
                <Link to="/catalogo" className="tabla-comparacion-hueco">
                  <i className="bi bi-plus-lg fs-4" aria-hidden="true" />
                  <span className="small">Elegí productos en el catálogo</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody aria-hidden="true">
          <tr>
            <th scope="row" className="tabla-comparacion-spec">
              Precio
            </th>
            {columnas.map((columna) => (
              <td key={columna}>
                <span className="tabla-comparacion-relleno" />
              </td>
            ))}
          </tr>
          {filas.map((fila) => (
            <tr key={fila}>
              <th scope="row" className="tabla-comparacion-spec">
                <span className="tabla-comparacion-relleno" />
              </th>
              {columnas.map((columna) => (
                <td key={columna}>
                  <span className="tabla-comparacion-relleno" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
