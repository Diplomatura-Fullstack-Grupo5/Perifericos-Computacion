
import { useState } from "react";
import { esNombreValido } from "../utils/validarNombre";

/**
 * Formulario de registro con validación de datos ingresados por el usuario.
 * @param {{ onSubmit: (usuario: { name: string, email: string, password: string }) => Promise<boolean>, mensaje: { tipo: string, texto: string }|null, enviando: boolean }} props
 * @returns {JSX.Element}
 */
export function FormularioRegistro({ onSubmit, mensaje, enviando }) {
  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorValidacion, setErrorValidacion] = useState(null);

  function manejarCambio(event) {
    const { name, value } = event.target;

    if (name === "name" && value && !esNombreValido(value)) {
      setErrorValidacion("El nombre completo solo puede contener letras.");
    } else {
      setErrorValidacion(null);
    }

    setFormulario((actual) => ({
      ...actual,
      [name]: name === "name"
        ? value.replace(/[^\p{L} '-]/gu, "")
        : value,
    }));
  }

  async function manejarEnvio(event) {
    event.preventDefault();

    if (!esNombreValido(formulario.name)) {
      setErrorValidacion("El nombre completo solo puede contener letras.");
      return;
    }

    if (formulario.password !== formulario.confirmPassword) {
      setErrorValidacion("Las contraseñas no coinciden.");
      return;
    }

    setErrorValidacion(null);
    const registrado = await onSubmit({
      name: formulario.name.trim(),
      email: formulario.email.trim(),
      password: formulario.password,
    });

    if (registrado) {
      setFormulario({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="registro-form">

      <div className="registro-campo">
        <label htmlFor="registro-name">
          Nombre completo
        </label>

        <input
          id="registro-name"
          name="name"
          type="text"
          maxLength={100}
          autoComplete="name"
          value={formulario.name}
          onChange={manejarCambio}
          placeholder="Ingresá tu nombre"
          required
        />
      </div>

      <div className="registro-campo">
        <label htmlFor="registro-email">
          Correo electrónico
        </label>

        <input
          id="registro-email"
          name="email"
          type="email"
          maxLength={254}
          autoComplete="email"
          value={formulario.email}
          onChange={manejarCambio}
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <div className="registro-campo">
        <label htmlFor="registro-password">
          Contraseña
        </label>

        <input
          id="registro-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          value={formulario.password}
          onChange={manejarCambio}
          aria-describedby="registro-password-ayuda"
          placeholder="Ingresá tu contraseña"
          required
        />

        <small id="registro-password-ayuda">
          Debe tener al menos 8 caracteres.
        </small>
      </div>

      <div className="registro-campo">
        <label htmlFor="registro-confirm-password">
          Confirmar contraseña
        </label>

        <input
          id="registro-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={formulario.confirmPassword}
          onChange={manejarCambio}
          placeholder="Repetí tu contraseña"
          required
        />
      </div>

      {mensaje && (
        <div
          className={`registro-mensaje registro-mensaje-${mensaje.tipo}`}
          role={mensaje.tipo === "success" ? "status" : "alert"}
          aria-live="polite"
        >
          {mensaje.texto}
        </div>
      )}
      {errorValidacion && (
        <div className="registro-mensaje registro-mensaje-danger" role="alert">
          {errorValidacion}
        </div>
      )}

      <button type="submit" className="registro-boton" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

    </form>
  );
}