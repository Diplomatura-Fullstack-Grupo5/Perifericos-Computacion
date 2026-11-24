import { useState } from "react";
import { Link } from "react-router";
import "./TarjetaProducto.css";
import { formatearValorSpec } from "../../../shared/utils/formatearValorSpec";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

/**
 * Tarjeta de un producto en la grilla del catálogo. La imagen y el nombre llevan a su ficha.
 * @param {object} props
 * @param {number} props.id Id del producto, para el link a `/producto/:id`.
 * @param {string} props.name
 * @param {number} props.price
 * @param {string} [props.image]
 * @param {number} props.stock
 * @param {Object<string, *>} props.specs
 * @param {Object<string, object>} [props.specsDefinitions] Definiciones de specs de la categoría.
 * @returns {JSX.Element}
 */
export function TarjetaProducto({
  id,
  name,
  price,
  image,
  stock,
  specs,
  specsDefinitions,
}) {
  const sinStock = stock === 0;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <div className="card h-100 product-card">
      {/* -------------------- Imagen -------------------- */}
      {/* Fuera del orden de tabulación: el nombre ya es un link a la misma ficha. */}
      <Link
        to={`/producto/${id}`}
        tabIndex={-1}
        aria-hidden="true"
        className={`product-card-image text-decoration-none ${showImage ? "" : "product-card-image-empty"}`}
      >
        {showImage ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          "Sin imagen"
        )}
      </Link>

      {/* -------------------- Nombre -------------------- */}
      <div className="card-body d-flex flex-column p-3">
        <h3 className="card-title fs-6 fw-semibold mb-2">
          <Link to={`/producto/${id}`} className="product-card-name">
            {name}
          </Link>
        </h3>

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
                {formatearValorSpec(value, specsDefinitions[key].unit)}
              </span>
            ))}
        </div>

        {/* -------------------- Precio -------------------- */}
        <p className="fs-5 fw-bold text-primary mb-3">
          {formatearPrecio(price)}
        </p>

        {/* -------------------- Check y Boton -------------------- */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <label className="d-flex align-items-center gap-2 small mb-0 product-card-compare">
            <input type="checkbox" className="form-check-input m-0" />
            Comparar
          </label>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-semibold ${sinStock ? "btn-outline-secondary" : "btn-primary"}`}
            disabled={sinStock}
          >
            {sinStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
