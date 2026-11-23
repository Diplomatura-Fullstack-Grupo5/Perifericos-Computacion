import "./FiltroRango.css";

const TECLAS_BLOQUEADAS = ["-", "+", "e", "E"];

/**
 * Convierte el texto de un input numérico en un número de 0 en adelante, o en null si está vacío.
 * @param {string} text
 * @returns {number | null}
 */
function toNumberOrNull(text) {
  return text === "" ? null : Math.max(0, Number(text));
}

/**
 * Evita escribir signos y notación científica (`-`, `+`, `e`) en un input numérico.
 * @param {import("react").KeyboardEvent<HTMLInputElement>} e
 */
function bloquearTeclasNoValidas(e) {
  if (TECLAS_BLOQUEADAS.includes(e.key)) e.preventDefault();
}

/**
 * Filtro genérico de rango con dos campos: mínimo y máximo. Un campo vacío significa "sin límite".
 * @param {object} props
 * @param {string} props.title Título del filtro (ej. "Peso").
 * @param {string} [props.unit] Unidad que se muestra junto al título (ej. "g").
 * @param {{ min: number | null, max: number | null }} [props.value] Rango actual.
 * @param {(range: { min: number | null, max: number | null }) => void} props.onChange Se llama al cambiar cualquiera de los dos campos.
 */
export function FiltroRango({ title, unit, value = {}, onChange }) {
  const { min = null, max = null } = value;
  const invalid = min !== null && max !== null && min > max;
  const inputClass = `form-control form-control-sm range-filter-input ${invalid ? "is-invalid" : ""}`;

  return (
    <div className="mb-3">
      <h3 className="small text-secondary fw-normal mb-1">
        {title}
        {unit && ` (${unit})`}
      </h3>

      <div className="d-flex align-items-center gap-1">
        <input
          type="number"
          min="0"
          className={inputClass}
          placeholder="Mín"
          aria-label={`${title} mínimo`}
          value={min ?? ""}
          onKeyDown={bloquearTeclasNoValidas}
          onChange={(e) => onChange({ min: toNumberOrNull(e.target.value), max })}
        />
        <span className="text-secondary">–</span>
        <input
          type="number"
          min="0"
          className={inputClass}
          placeholder="Máx"
          aria-label={`${title} máximo`}
          value={max ?? ""}
          onKeyDown={bloquearTeclasNoValidas}
          onChange={(e) => onChange({ min, max: toNumberOrNull(e.target.value) })}
        />
      </div>
    </div>
  );
}
