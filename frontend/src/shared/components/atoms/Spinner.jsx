/**
 * Indicador de carga centrado.
 * @param {object} props
 * @param {string} [props.texto] Texto para lectores de pantalla.
 */
export function Spinner({ texto = "Cargando..." }) {
  return (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{texto}</span>
      </div>
    </div>
  );
}
