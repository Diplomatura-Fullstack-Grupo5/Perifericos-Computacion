import { formatearValorSpec } from "../../../shared/utils/formatearValorSpec";

/**
 * Información completa de un producto, para ver sin entrar a editarlo: descripción, ventas, imagen
 * y especificaciones técnicas (con su etiqueta y unidad; las que no aplican se muestran como "—").
 * @param {object} props
 * @param {object} props.producto
 * @param {Object<string, {label: string, unit?: string}>} [props.definiciones] Definiciones de specs de su categoría.
 * @returns {JSX.Element}
 */
export function DetalleProducto({ producto, definiciones = {} }) {
  return (
    <div className="row g-4">
      {/* -------------------- Datos generales -------------------- */}
      <div className="col-md-5">
        <dl className="mb-0">
          <dt className="small text-secondary fw-normal">Descripción</dt>
          <dd>{producto.description}</dd>
          <dt className="small text-secondary fw-normal">Unidades vendidas</dt>
          <dd>{producto.sold}</dd>
          <dt className="small text-secondary fw-normal">Imagen</dt>
          <dd className="mb-0">
            <code>{producto.image}</code>
          </dd>
        </dl>
      </div>

      {/* -------------------- Especificaciones -------------------- */}
      <div className="col-md-7">
        <table className="table table-sm table-bordered bg-body mb-0">
          <caption className="caption-top pt-0 small text-secondary">
            Especificaciones técnicas
          </caption>
          <tbody>
            {Object.entries(producto.specs).map(([clave, valor]) => (
              <tr key={clave}>
                <th scope="row" className="fw-normal text-secondary">
                  {definiciones[clave]?.label ?? clave}
                </th>
                <td>
                  {valor === null ? "—" : formatearValorSpec(valor, definiciones[clave]?.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
