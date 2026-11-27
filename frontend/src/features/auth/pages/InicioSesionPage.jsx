import { useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { PresentacionInicioSesion } from "../components/PresentacionInicioSesion";
import { iniciarSesion } from "../services/authService";

/**
 * Devuelve la página a la que hay que volver después de iniciar sesión, si quien abrió el login la
 * indicó en el `state` de la navegación (ej. `{ volverA: "/finalizar-compra" }`). Solo acepta rutas
 * internas del sitio.
 * @param {*} state `location.state` de React Router.
 * @returns {string | null}
 */
function obtenerDestino(state) {
  const destino = state?.volverA;
  const esRutaInterna =
    typeof destino === "string" && destino.startsWith("/") && !destino.startsWith("//");
  return esRutaInterna ? destino : null;
}

/**
 * Página pública de inicio de sesión. Al entrar, lleva al panel (administradores), a la página
 * indicada en `state.volverA` o al inicio.
 * @returns {JSX.Element}
 */
export function InicioSesionPage() {
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { actualizarUsuario } = useOutletContext();
  const navegar = useNavigate();
  const { state } = useLocation();

  async function manejarInicioSesion(credenciales) {
    setMensaje(null);
    setEnviando(true);

    try {
      const usuario = await iniciarSesion(credenciales);
      actualizarUsuario(usuario);
      navegar(usuario.role === "administrador" ? "/admin" : (obtenerDestino(state) ?? "/"), {
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
