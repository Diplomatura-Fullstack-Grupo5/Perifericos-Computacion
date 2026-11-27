import { useState } from "react";
import { MEDIOS_DE_PAGO } from "../services/pedidosService";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";

const FORMULARIO_VACIO = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "",
};

/** Cantidad de dígitos que acepta el teléfono (sin contar espacios, `+` ni `-`). */
const DIGITOS_TELEFONO = { min: 8, max: 15 };

/**
 * Explica qué tiene de malo un teléfono, o devuelve "" si es válido.
 * @param {string} telefono
 * @returns {string}
 */
function validarTelefono(telefono) {
  const digitos = telefono.replace(/\D/g, "").length;
  if (digitos < DIGITOS_TELEFONO.min || digitos > DIGITOS_TELEFONO.max) {
    return `El teléfono tiene que tener entre ${DIGITOS_TELEFONO.min} y ${DIGITOS_TELEFONO.max} dígitos.`;
  }
  return "";
}

/**
 * Formulario con los datos del comprador: contacto, envío y medio de pago.
 * Valida con la validación nativa del navegador y muestra los errores junto a cada campo
 * recién al intentar confirmar.
 * @param {object} props
 * @param {number} props.total Total del pedido, para mostrar junto al botón.
 * @param {boolean} [props.enviando] Deshabilita el botón mientras se guarda el pedido.
 * @param {(datos: typeof FORMULARIO_VACIO) => void} props.onConfirmar Recibe los datos sin espacios
 *   de más.
 * @returns {JSX.Element}
 */
export function FormularioComprador({ total, enviando = false, onConfirmar }) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [validado, setValidado] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") e.target.setCustomValidity(validarTelefono(value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    form.elements.phone.setCustomValidity(validarTelefono(formulario.phone));

    if (!form.checkValidity()) {
      setValidado(true);
      form.querySelector(":invalid")?.focus();
      return;
    }

    const datos = Object.fromEntries(
      Object.entries(formulario).map(([clave, valor]) => [clave, valor.trim()]),
    );
    onConfirmar(datos);
  }

  return (
    <form className={`card card-body ${validado ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
      <p className="form-text mt-0">Todos los datos son obligatorios.</p>

      {/* -------------------- Contacto -------------------- */}
      <fieldset className="row g-3 mb-4">
        <legend className="fs-5">Datos de contacto</legend>

        <div className="col-12">
          <label htmlFor="comprador-name" className="form-label">
            Nombre y apellido
          </label>
          <input
            id="comprador-name"
            name="name"
            type="text"
            className="form-control"
            autoComplete="name"
            required
            minLength={3}
            maxLength={80}
            pattern="[\p{L}' \-]+"
            value={formulario.name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">
            Ingresá tu nombre y apellido, solo con letras (podés usar espacios, apóstrofos y guiones).
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor="comprador-email" className="form-label">
            Email
          </label>
          <input
            id="comprador-email"
            name="email"
            type="email"
            className="form-control"
            autoComplete="email"
            required
            maxLength={120}
            value={formulario.email}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá un email válido, por ejemplo nombre@mail.com.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor="comprador-phone" className="form-label">
            Teléfono
          </label>
          <input
            id="comprador-phone"
            name="phone"
            type="tel"
            className="form-control"
            autoComplete="tel"
            required
            pattern="[0-9 +\-]+"
            maxLength={20}
            value={formulario.phone}
            onChange={handleChange}
          />
          <div className="invalid-feedback">
            Ingresá un teléfono de {DIGITOS_TELEFONO.min} a {DIGITOS_TELEFONO.max} dígitos (podés
            usar espacios, + y -).
          </div>
        </div>
      </fieldset>

      {/* -------------------- Envío -------------------- */}
      <fieldset className="row g-3 mb-4">
        <legend className="fs-5">Envío</legend>

        <div className="col-12">
          <label htmlFor="comprador-address" className="form-label">
            Dirección
          </label>
          <input
            id="comprador-address"
            name="address"
            type="text"
            className="form-control"
            autoComplete="street-address"
            placeholder="Calle, número, piso y depto."
            required
            minLength={5}
            maxLength={120}
            value={formulario.address}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá la calle y el número.</div>
        </div>

        <div className="col-md-8">
          <label htmlFor="comprador-city" className="form-label">
            Ciudad
          </label>
          <input
            id="comprador-city"
            name="city"
            type="text"
            className="form-control"
            autoComplete="address-level2"
            required
            maxLength={80}
            value={formulario.city}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá la ciudad.</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="comprador-postalCode" className="form-label">
            Código postal
          </label>
          <input
            id="comprador-postalCode"
            name="postalCode"
            type="text"
            className="form-control"
            autoComplete="postal-code"
            required
            pattern="[0-9]{4}|[A-Za-z][0-9]{4}[A-Za-z]{3}"
            maxLength={8}
            value={formulario.postalCode}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Usá 4 dígitos (1425) o el formato C1425ABC.</div>
        </div>
      </fieldset>

      {/* -------------------- Medio de pago -------------------- */}
      <fieldset className="mb-4">
        <legend className="fs-5">Medio de pago</legend>
        {MEDIOS_DE_PAGO.map((medio, indice) => (
          <div key={medio} className="form-check">
            <input
              id={`comprador-pago-${indice}`}
              name="paymentMethod"
              type="radio"
              className="form-check-input"
              required
              value={medio}
              checked={formulario.paymentMethod === medio}
              onChange={handleChange}
            />
            <label htmlFor={`comprador-pago-${indice}`} className="form-check-label">
              {medio}
            </label>
            {indice === MEDIOS_DE_PAGO.length - 1 && (
              <div className="invalid-feedback">Elegí cómo vas a pagar.</div>
            )}
          </div>
        ))}
      </fieldset>

      {/* -------------------- Confirmar -------------------- */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-top pt-3">
        <div>
          <span className="text-secondary me-2">Total</span>
          <span className="fs-4 fw-bold text-primary">{formatearPrecio(total)}</span>
        </div>
        <button type="submit" className="btn btn-primary btn-lg fw-semibold" disabled={enviando}>
          {enviando ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </div>
    </form>
  );
}
