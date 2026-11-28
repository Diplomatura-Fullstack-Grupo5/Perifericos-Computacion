import { useState } from "react";
import { useOutletContext } from "react-router";
import { HistorialPedidos } from "../../pedidos";
import { FormularioDatosCuenta } from "../components/FormularioDatosCuenta";
import { actualizarDatosUsuario } from "../services/authService";

/**
 * Página de información personal e historial de pedidos del cliente.
 * @returns {JSX.Element}
 */
export function MiCuentaPage() {
  const { usuario, actualizarUsuario } = useOutletContext();
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (!usuario) return null;

  async function manejarGuardarDatos(datos) {
    setMensaje(null);
    setEnviando(true);

    try {
      const usuarioActualizado = await actualizarDatosUsuario(datos);
      actualizarUsuario(usuarioActualizado);
      setMensaje({ tipo: "success", texto: "Tus datos se actualizaron correctamente." });
    } catch (error) {
      console.error("Error al actualizar los datos de la cuenta:", error);
      setMensaje({
        tipo: "danger",
        texto: error.status ? error.message : "No se pudieron guardar tus datos.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container py-4 py-md-5">
      <header className="mb-4">
        <h1 className="h2 mb-2">Mi cuenta</h1>
        <p className="text-secondary mb-0">Consultá tus datos y el historial de pedidos.</p>
      </header>

      <section className="card mb-4" aria-labelledby="datos-cuenta-titulo">
        <div className="card-header">
          <h2 className="h5 mb-0" id="datos-cuenta-titulo">Mis datos</h2>
        </div>
        <div className="card-body">
          <FormularioDatosCuenta
            usuario={usuario}
            onGuardar={manejarGuardarDatos}
            enviando={enviando}
            mensaje={mensaje}
          />
        </div>
      </section>

      <section aria-labelledby="historial-pedidos-titulo">
        <header className="mb-3">
          <h2 className="h4 mb-1" id="historial-pedidos-titulo">Mis pedidos</h2>
        </header>
        <HistorialPedidos userId={usuario.id} />
      </section>
    </div>
  );
}
