import { useState } from "react";
import "./ImagenProducto.css";

/**
 * Imagen principal del producto. Si no hay imagen o no carga, muestra "Sin imagen".
 * @param {object} props
 * @param {string} [props.image] Ruta de la imagen.
 * @param {string} props.name Nombre del producto, usado como texto alternativo.
 * @returns {JSX.Element}
 */
export function ImagenProducto({ image, name }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <div className={`ficha-imagen ${showImage ? "" : "ficha-imagen-vacia"}`}>
      {showImage ? (
        <img src={image} alt={name} onError={() => setImageFailed(true)} />
      ) : (
        "Sin imagen"
      )}
    </div>
  );
}
