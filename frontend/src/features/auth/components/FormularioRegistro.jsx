
import { useState } from "react";
import { registrarUsuario } from "../services/authService";

export function FormularioRegistro() {
  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setMensaje(null);
  }

  async function manejarEnvio(event) {
    event.preventDefault();

    if (formulario.password !== formulario.confirmPassword) {
      setMensaje({
        tipo: "danger",
        texto: "Las contraseñas no coinciden.",
      });
      return;
    }

    setEnviando(true);
    setMensaje(null);

    try {
      const usuario = await registrarUsuario({
        name: formulario.name.trim(),
        email: formulario.email.trim(),
        password: formulario.password,
      });

      setMensaje({
        tipo: "success",
        texto: `¡Cuenta creada correctamente para ${usuario.email}!`,
      });
      setFormulario({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setMensaje({
        tipo: "danger",
        texto: error.status
          ? error.message
          : "No se pudo conectar con el servicio de registro. Intentá nuevamente.",
      });
    } finally {
      setEnviando(false);
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

      <button type="submit" className="registro-boton" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

    </form>
  );
}