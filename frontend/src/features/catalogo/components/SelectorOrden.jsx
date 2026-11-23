import { OPCIONES_ORDEN } from "../services/catalogoService";

export function SelectorOrden({ sort, onChange }) {
  const sortLabel = OPCIONES_ORDEN.find((option) => option.value === sort).label;

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-sm btn-link text-secondary text-decoration-none dropdown-toggle p-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Ordenar por: {sortLabel}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
        {OPCIONES_ORDEN.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={`dropdown-item small ${option.value === sort ? "active" : ""}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
