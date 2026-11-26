
import { FormularioRegistro } from "../components/FormularioRegistro";
import "../components/FormularioRegistro.css";

export function RegistroPage() {
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

          <FormularioRegistro />

          <p className="registro-login">
            ¿Ya tenés una cuenta?{" "}
            <a href="/login">Iniciar sesión</a>
          </p>
        </section>

      </div>
    </main>
  );
}