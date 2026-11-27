import { useState } from "react";
import "./FormularioInicioSesion.css";

/**
 * Recoge y valida las credenciales para que la página gestione el inicio de sesión.
 * @param {{ onSubmit: (credenciales: { email: string, password: string }) => void, mensaje: { tipo: string, texto: string }|null, enviando: boolean }} props
 * @returns {JSX.Element}
 */
export function FormularioInicioSesion({ onSubmit, mensaje, enviando }) {
  const [formulario, setFormulario] = useState({ email: "", password: "" });
  const [mostrarPassword, setMostrarPassword] = useState(false);

  function manejarCambio(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function manejarEnvio(event) {
    event.preventDefault();
    onSubmit({
      email: formulario.email.trim(),
      password: formulario.password,
    });
  }

  return (
    <form onSubmit={manejarEnvio} className="login-form">
      <div className="login-campo">
        <label className="visually-hidden" htmlFor="inicio-sesion-email">
          Correo electrónico
        </label>
        <div className="login-input-con-icono">
          <i className="bi bi-envelope" aria-hidden="true" />
          <input
            id="inicio-sesion-email"
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            value={formulario.email}
            onChange={manejarCambio}
            placeholder="Correo electrónico"
            required
          />
        </div>
      </div>

      <div className="login-campo">
        <label className="visually-hidden" htmlFor="inicio-sesion-password">
          Contraseña
        </label>
        <div className="login-input-con-icono">
          <i className="bi bi-lock" aria-hidden="true" />
          <input
            id="inicio-sesion-password"
            name="password"
            type={mostrarPassword ? "text" : "password"}
            maxLength={128}
            autoComplete="current-password"
            value={formulario.password}
            onChange={manejarCambio}
            placeholder="Contraseña"
            required
          />
          <button
            className="login-mostrar-password"
            type="button"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={mostrarPassword}
            onClick={() => setMostrarPassword(!mostrarPassword)}
          >
            <i
              className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`login-mensaje login-mensaje-${mensaje.tipo}`}
          role="alert"
          aria-live="polite"
        >
          {mensaje.texto}
        </div>
      )}

      <button type="submit" className="login-boton" disabled={enviando}>
        <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
        {enviando ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
