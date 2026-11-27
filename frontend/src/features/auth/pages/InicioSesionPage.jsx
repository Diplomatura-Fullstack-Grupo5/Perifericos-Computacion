import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { PresentacionInicioSesion } from "../components/PresentacionInicioSesion";
import { iniciarSesion } from "../services/authService";

/**
 * Página pública de inicio de sesión.
 * @returns {JSX.Element}
 */
export function InicioSesionPage() {
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { actualizarUsuario } = useOutletContext();
  const navegar = useNavigate();

  async function manejarInicioSesion(credenciales) {
    setMensaje(null);
    setEnviando(true);

    try {
      const usuario = await iniciarSesion(credenciales);
      actualizarUsuario(usuario);
      navegar(usuario.role === "administrador" ? "/admin" : "/", {
        replace: true,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje({
        tipo: "danger",
        texto: error.status
          ? error.message
          : "No se pudo conectar con el servicio de acceso. Intentá nuevamente.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <PresentacionInicioSesion
      onSubmit={manejarInicioSesion}
      mensaje={mensaje}
      enviando={enviando}
    />
  );
}
