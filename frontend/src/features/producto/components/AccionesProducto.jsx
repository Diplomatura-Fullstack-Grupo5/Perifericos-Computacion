/**
 * Botones de la ficha: agregar al carrito y al comparador.
 * Por ahora son solo visuales: se conectan cuando existan el carrito y el comparador.
 * @param {object} props
 * @param {number} props.stock Unidades disponibles; sin stock, no se puede agregar al carrito.
 * @returns {JSX.Element}
 */
export function AccionesProducto({ stock }) {
  const sinStock = stock === 0;

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {/* TODO: agregar al carrito cuando exista CarritoContext */}
      <button
        type="button"
        className={`btn fw-semibold ${sinStock ? "btn-outline-secondary" : "btn-primary"}`}
        disabled={sinStock}
      >
        {sinStock ? "Sin stock" : "Agregar al carrito"}
      </button>
      {/* TODO: agregar al comparador cuando exista ComparadorContext */}
      <button type="button" className="btn btn-outline-primary fw-semibold">
        ⇄ Agregar al comparador
      </button>
    </div>
  );
}
