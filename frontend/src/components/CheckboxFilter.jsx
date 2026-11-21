/**
 * Filtro genérico con un título y una lista de checkboxes.
 * @param {object} props
 * @param {string} props.title Título del filtro (ej. "Marca").
 * @param {Array} props.options Opciones a mostrar.
 * @param {Array} props.selected Opciones marcadas.
 * @param {(option: any) => void} props.onToggle Se llama al marcar o desmarcar una opción.
 * @param {(option: any) => string} [props.formatOption] Texto a mostrar por opción (ej. true → "Sí").
 */
export function CheckboxFilter({
  title,
  options,
  selected,
  onToggle,
  formatOption = (option) => option,
}) {
  return (
    <div className="mb-3">
      <h3 className="small text-secondary fw-normal mb-1">{title}</h3>

      {options.map((option) => (
        <label
          key={String(option)}
          className="d-flex align-items-center gap-2 mb-1"
          style={{ cursor: "pointer" }}
        >
          <input
            type="checkbox"
            className="form-check-input m-0"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          {formatOption(option)}
        </label>
      ))}
    </div>
  );
}
