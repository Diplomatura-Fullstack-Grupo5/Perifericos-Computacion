import { Link } from "react-router";

/** Al terminar de iniciar sesión (o de registrarse y entrar), el login vuelve a esta página. */
const VOLVER_A_FINALIZAR_COMPRA = { volverA: "/finalizar-compra" };

/**
 * Aviso de la página de finalizar compra que ofrece iniciar sesión o crear una cuenta antes de
 * completar los datos. Comprar sin cuenta también está permitido. Después de entrar, el login
 * vuelve a finalizar compra.
 * @returns {JSX.Element}
 */
export function AvisoSesion() {
  return (
    <div className="alert alert-primary d-flex flex-wrap align-items-center gap-2 mb-4" role="note">
      <i className="bi bi-person-circle fs-5" aria-hidden="true" />
      <span className="me-auto">
        ¿Tenés cuenta? Iniciá sesión para completar tus datos y seguir tus pedidos. También podés
        comprar sin cuenta.
      </span>
      <div className="d-flex gap-2">
        <Link to="/iniciar-sesion" state={VOLVER_A_FINALIZAR_COMPRA} className="btn btn-sm btn-primary">
          Iniciar sesión
        </Link>
        <Link to="/registrarse" state={VOLVER_A_FINALIZAR_COMPRA} className="btn btn-sm btn-outline-primary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
