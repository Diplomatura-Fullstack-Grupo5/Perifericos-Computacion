import "../styles/ProductCard.css";

export function ProductCard({ name, price }) {
  return (
    <div className="card h-100 product-card">
      {/* Temporal: recuadro gris hasta que los productos tengan imagen */}
      <div className="product-card-image">imagen</div>

      <div className="card-body d-flex flex-column p-3">
        <h3 className="card-title fs-6 fw-semibold mb-2">{name}</h3>

        {/* Temporal: specs fijas, reemplazar por las specs del producto */}
        <div className="d-flex flex-wrap gap-1 mb-2">
          <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-normal">
            25.600 DPI
          </span>
          <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-normal">
            63 g
          </span>
        </div>

        <p className="fs-5 fw-bold text-primary mb-3">
          ${price.toLocaleString("es-AR")}
        </p>

        {/* mt-auto empuja esta fila al fondo para que todas las tarjetas queden alineadas */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <label className="d-flex align-items-center gap-2 small mb-0">
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
