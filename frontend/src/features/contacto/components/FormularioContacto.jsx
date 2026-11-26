import { useState } from "react";

const ASUNTOS = [
  "Consulta sobre un producto",
  "Estado de un pedido",
  "Cambios y devoluciones",
  "Garantía",
  "Otro",
];

const CONSULTA_VACIA = { nombre: "", email: "", asunto: "", mensaje: "" };

/**
 * Formulario de consulta. No envía nada a ningún lado: si los datos son válidos, simula el envío
 * limpiando los campos y mostrando un aviso de éxito. Si falta algo o el email no es válido, marca
 * los campos con su mensaje (validación de Bootstrap).
 * @returns {JSX.Element}
 */
export function FormularioContacto() {
  const [consulta, setConsulta] = useState(CONSULTA_VACIA);
  const [validado, setValidado] = useState(false);
  const [enviadoPor, setEnviadoPor] = useState(null);

  function cambiarCampo(e) {
    const { name, value } = e.target;
    setConsulta((prev) => ({ ...prev, [name]: value }));
  }

  function enviar(e) {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      setValidado(true);
      setEnviadoPor(null);
      return;
    }

    setEnviadoPor(consulta.nombre.trim());
    setConsulta(CONSULTA_VACIA);
    setValidado(false);
  }

  return (
    <form
      noValidate
      className={validado ? "was-validated" : undefined}
      onSubmit={enviar}
    >
      <div className="row g-3">
        <div className="col-sm-6">
          <label htmlFor="contacto-nombre" className="form-label fw-semibold small">
            Nombre
          </label>
          <input
            id="contacto-nombre"
            name="nombre"
            type="text"
            className="form-control"
            placeholder="Martina Gómez"
            autoComplete="name"
            required
            value={consulta.nombre}
            onChange={cambiarCampo}
          />
          <div className="invalid-feedback">Ingresá tu nombre.</div>
        </div>

        <div className="col-sm-6">
          <label htmlFor="contacto-email" className="form-label fw-semibold small">
            Email
          </label>
          <input
            id="contacto-email"
            name="email"
            type="email"
            className="form-control"
            placeholder="martina.gomez@correo.com"
            autoComplete="email"
            required
            value={consulta.email}
            onChange={cambiarCampo}
          />
          <div className="invalid-feedback">Ingresá un email válido.</div>
        </div>

        <div className="col-12">
          <label htmlFor="contacto-asunto" className="form-label fw-semibold small">
            Asunto
          </label>
          <select
            id="contacto-asunto"
            name="asunto"
            className="form-select"
            required
            value={consulta.asunto}
            onChange={cambiarCampo}
          >
            <option value="" disabled>
              Elegí un asunto
            </option>
            {ASUNTOS.map((asunto) => (
              <option key={asunto} value={asunto}>
                {asunto}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Elegí un asunto.</div>
        </div>

        <div className="col-12">
          <label htmlFor="contacto-mensaje" className="form-label fw-semibold small">
            Mensaje
          </label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            className="form-control"
            rows={5}
            placeholder="Hola, quería saber si el mouse es compatible con Linux y cuánto tarda el envío a Mendoza."
            required
            value={consulta.mensaje}
            onChange={cambiarCampo}
          />
          <div className="invalid-feedback">Escribí tu consulta.</div>
        </div>
      </div>

      {enviadoPor && (
        <div
          className="alert alert-success alert-dismissible d-flex align-items-center gap-2 mt-3 mb-0"
          role="status"
        >
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
          <span>
            ¡Gracias, {enviadoPor}! Recibimos tu consulta y te respondemos en menos de 24
            horas.
          </span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setEnviadoPor(null)}
          />
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
        <button type="submit" className="btn btn-primary fw-semibold px-4">
          Enviar consulta
        </button>
        <span className="small text-body-secondary">Todos los campos son obligatorios.</span>
      </div>
    </form>
  );
}
