import "../styles/ProductCard.css";

function formatSpecValue(value, unit) {
  switch (typeof value) {
    case "boolean":
      return value ? "Sí" : "No";
    case "number": {
      const formattedValue = value.toLocaleString("es-AR");
      if (unit === '"') return `${formattedValue}${unit}`;
      if (unit != null) return `${formattedValue} ${unit}`;
      return formattedValue;
    }
    default:
      return value;
  }
}

export function ProductCard({ name, price, specs, specsDefinitions }) {
  return (
    <div className="card h-100 product-card">
      {/* -------------------- Imagen -------------------- */}
      {/* Temporal: recuadro gris hasta que los productos tengan imagen */}
      <div className="product-card-image">imagen</div>

      {/* -------------------- Nombre -------------------- */}
      <div className="card-body d-flex flex-column p-3">
        <h3 className="card-title fs-6 fw-semibold mb-2">{name}</h3>

        {/* -------------------- Pills -------------------- */}
        <div className="d-flex flex-wrap mb-2 gap-1">
          {Object.entries(specs)
            .filter(
              ([key, value]) =>
                specsDefinitions?.[key]?.featured && value !== null,
            )
            .map(([key, value]) => (
              <span
                key={key}
                className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-normal"
                title={specsDefinitions[key].label}
              >
                {formatSpecValue(value, specsDefinitions[key].unit)}
              </span>
            ))}
        </div>

        {/* -------------------- Precio -------------------- */}
        <p className="fs-5 fw-bold text-primary mb-3">
          ${price.toLocaleString("es-AR")}
        </p>

        {/* -------------------- Check y Boton -------------------- */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <label className="d-flex align-items-center gap-2 small mb-0 product-card-compare">
            <input type="checkbox" className="form-check-input m-0" />
            Comparar
          </label>
          <button
            type="button"
            className="btn btn-primary btn-sm px-3 fw-semibold"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
