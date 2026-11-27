import { useState } from "react";
import { AvisoBloqueoComparador, useComparador } from "../../comparador";
import { useCarrito } from "../../carrito";

/**
 * Botones de la ficha: agregar al carrito y agregar o quitar del comparador.
 * @param {object} props
 * @param {number} props.id Id del producto.
 * @param {string} props.category Categoría, para el comparador (solo compara una categoría a la vez).
 * @param {string} props.name Nombre, precio e imagen: el carrito guarda una copia.
 * @param {number} props.price
 * @param {string} [props.image]
 * @param {number} props.stock Unidades disponibles; sin stock, no se puede agregar al carrito.
 * @returns {JSX.Element}
 */
export function AccionesProducto({ id, category, name, price, image, stock }) {
  const sinStock = stock === 0;
  const { agregar } = useCarrito();
  const { estaSeleccionado, motivoBloqueo, alternar } = useComparador();
  const comparando = estaSeleccionado(id);
  const bloqueoComparar = motivoBloqueo({ id, category });
  const [avisoAbierto, setAvisoAbierto] = useState(false);

  function alternarComparar() {
    if (bloqueoComparar) setAvisoAbierto(true);
    else alternar({ id, category });
  }

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        className={`btn fw-semibold ${sinStock ? "btn-outline-secondary" : "btn-primary"}`}
        disabled={sinStock}
        onClick={() => agregar({ id, name, price, image, stock })}
      >
        {sinStock ? "Sin stock" : "Agregar al carrito"}
      </button>
      <button
        type="button"
        className={`btn fw-semibold ${comparando ? "btn-outline-secondary" : "btn-outline-primary"}`}
        aria-pressed={comparando}
        onClick={alternarComparar}
      >
        {comparando ? (
          <>
            <i className="bi bi-x-lg me-1" aria-hidden="true" />
            Quitar del comparador
          </>
        ) : (
          "⇄ Agregar al comparador"
        )}
      </button>
      <AvisoBloqueoComparador
        bloqueo={bloqueoComparar}
        categoriaProducto={category}
        abierto={avisoAbierto}
        onCerrar={() => setAvisoAbierto(false)}
      />
    </div>
  );
}
