/**
 * Campo del formulario para una especificación técnica. El control depende del tipo de la spec:
 * número (con su unidad), sí/no, o texto con sugerencias de los valores ya usados. Vacío = no aplica.
 * @param {object} props
 * @param {string} props.id Id del control, para asociarlo con su etiqueta.
 * @param {{label: string, type: "number" | "boolean" | "text", unit?: string}} props.definicion
 * @param {string} props.value Valor actual, como texto.
 * @param {string[]} [props.sugerencias] Valores de texto que ya usan otros productos de la categoría.
 * @param {(value: string) => void} props.onChange
 * @returns {JSX.Element}
 */
export function CampoSpec({ id, definicion, value, sugerencias = [], onChange }) {
  const { label, type, unit } = definicion;

  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <div className="col-sm-6 col-lg-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      {type === "boolean" && (
        <select id={id} className="form-select" value={value} onChange={handleChange}>
          <option value="">No aplica</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      )}

      {type === "number" && (
        <div className="input-group has-validation">
          <input
            id={id}
            type="number"
            className="form-control"
            min="0"
            step="any"
            placeholder="No aplica"
            value={value}
            onChange={handleChange}
          />
          {unit && <span className="input-group-text">{unit}</span>}
          <div className="invalid-feedback">Ingresá un número de 0 en adelante.</div>
        </div>
      )}

      {type === "text" && (
        <>
          <input
            id={id}
            type="text"
            className="form-control"
            list={`${id}-sugerencias`}
            placeholder="No aplica"
            value={value}
            onChange={handleChange}
          />
          <datalist id={`${id}-sugerencias`}>
            {sugerencias.map((sugerencia) => (
              <option key={sugerencia} value={sugerencia} />
            ))}
          </datalist>
        </>
      )}
    </div>
  );
}
