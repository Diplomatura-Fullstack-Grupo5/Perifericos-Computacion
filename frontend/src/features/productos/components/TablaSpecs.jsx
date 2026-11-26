import { formatearValorSpec } from "../../../shared/utils/formatearValorSpec";
import "./TablaSpecs.css";

/**
 * Tabla de especificaciones técnicas de un producto. Las filas salen de las specs del producto;
 * la etiqueta y la unidad, de las definiciones de su categoría. Las specs en `null` (no aplica)
 * no se muestran.
 * @param {object} props
 * @param {Object<string, *>} props.specs Specs del producto, ej. `{ weight_g: 60 }`.
 * @param {Object<string, {label: string, unit?: string}>} [props.specsDefinitions] Definiciones de la categoría.
 * @returns {JSX.Element | null} `null` si el producto no tiene specs que mostrar.
 */
export function TablaSpecs({ specs, specsDefinitions = {} }) {
  const filas = Object.entries(specs).filter(([, value]) => value !== null);

  if (filas.length === 0) return null;

  return (
    <table className="table table-sm table-bordered mb-0 tabla-specs">
      <thead>
        <tr>
          <th colSpan={2} scope="colgroup" className="table-light">
            Especificaciones técnicas
          </th>
        </tr>
      </thead>
      <tbody>
        {filas.map(([key, value]) => (
          <tr key={key}>
            <th scope="row" className="fw-normal text-secondary">
              {specsDefinitions[key]?.label ?? key}
            </th>
            <td>{formatearValorSpec(value, specsDefinitions[key]?.unit)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
