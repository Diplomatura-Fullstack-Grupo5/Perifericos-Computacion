export function CheckboxFilter({ title, options, selected, onToggle }) {
  return (
    <div className="mb-3">
      <h3 className="small text-secondary fw-normal mb-1">{title}</h3>

      {options.map((option) => (
        <label
          key={option}
          className="d-flex align-items-center gap-2 mb-1"
          style={{ cursor: "pointer" }}
        >
          <input
            type="checkbox"
            className="form-check-input m-0"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
