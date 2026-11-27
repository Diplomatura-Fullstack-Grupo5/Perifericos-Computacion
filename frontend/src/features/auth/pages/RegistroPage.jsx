
import { FormularioRegistro } from "../components/FormularioRegistro";
import { useState } from "react";
import { Link } from "react-router";
import { registrarUsuario } from "../services/authService";
import "../components/FormularioRegistro.css";

/**
 * Coordina el registro y presenta sus estados de carga y resultado.
 * @returns {JSX.Element}
 */
export function RegistroPage() {
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarRegistro(datosUsuario) {
    setMensaje(null);
    setEnviando(true);

    try {
      const usuario = await registrarUsuario(datosUsuario);
      setMensaje({
        tipo: "success",
        texto: `¡Cuenta creada correctamente para ${usuario.email}!`,
      });
      return true;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setMensaje({
        tipo: "danger",
        texto: error.status
          ? error.message
          : "No se pudo conectar con el servicio de registro. Intentá nuevamente.",
      });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="registro-page">
      <div className="registro-layout">

        {/* Panel visual */}
        <section className="registro-panel-visual">
          <div className="registro-panel-contenido">

            <div className="registro-logo">
              <img src="/icon.svg" alt="PuntoTech" />
            </div>

            <div className="registro-texto-principal">
              <span className="registro-etiqueta">
                TECNOLOGÍA PARA VOS
              </span>

              <h2>
                Tu próximo
                <br />
                setup comienza
                <br />
                <span>acá.</span>
              </h2>

              <p>
                Descubrí periféricos, compará opciones
                y encontrá todo lo que necesitás.
              </p>
            </div>

          </div>
        </section>

        {/* Panel del formulario */}
        <section className="registro-panel-formulario">
          <div className="registro-header">
            <h1>Crear cuenta</h1>
          </div>

          <FormularioRegistro
            onSubmit={manejarRegistro}
            mensaje={mensaje}
            enviando={enviando}
          />

          <p className="registro-login">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/iniciar-sesion">Iniciar sesión</Link>
          </p>
        </section>

      </div>
    </main>
  );
}