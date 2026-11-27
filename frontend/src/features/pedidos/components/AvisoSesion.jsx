import { Link } from "react-router";

/**
 * Aviso de la página de finalizar compra que ofrece iniciar sesión o crear una cuenta antes de
 * completar los datos. Comprar sin cuenta también está permitido.
 * @returns {JSX.Element}
 */
export function AvisoSesion() {
  return (
    <div className="alert alert-primary d-flex flex-wrap align-items-center gap-2 mb-4" role="note">
      <i className="bi bi-person-circle fs-5" aria-hidden="true" />
      <span className="me-auto">
        ¿Tenés cuenta? Iniciá sesión para seguir tus pedidos. También podés comprar sin cuenta.
      </span>
      {/* TODO: cuando exista el login, completar el formulario con los datos de la cuenta */}
      <div className="d-flex gap-2">
        <Link to="/iniciar-sesion" className="btn btn-sm btn-primary">
          Iniciar sesión
        </Link>
        <Link to="/registrarse" className="btn btn-sm btn-outline-primary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
