import { useState } from "react";
import { esNombreValido } from "../utils/validarNombre";

/**
 * Permite editar los datos personales y de envío del usuario.
 * @param {object} props
 * @param {object} props.usuario
 * @param {(datos: object) => Promise<void>} props.onGuardar
 * @param {boolean} props.enviando
 * @param {object|null} props.mensaje
 * @returns {JSX.Element}
 */
export function FormularioDatosCuenta({ usuario, onGuardar, enviando, mensaje }) {
  const shippingAddress = usuario.shippingAddress ?? {};
  const [formulario, setFormulario] = useState({
    name: usuario.name,
    phone: usuario.phone ?? "",
    street: shippingAddress.street ?? "",
    city: shippingAddress.city ?? "",
    province: shippingAddress.province ?? "",
    postalCode: shippingAddress.postalCode ?? "",
  });
  const [errorValidacion, setErrorValidacion] = useState(null);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    if ((name === "name" || name === "city" || name === "province") && value && !esNombreValido(value)) {
      setErrorValidacion(
        name === "name"
          ? "El nombre completo solo puede contener letras."
          : name === "city"
            ? "La ciudad solo puede contener letras."
            : "La provincia solo puede contener letras.",
      );
    } else if (name === "phone" && value && !/^\d+$/.test(value)) {
      setErrorValidacion("El teléfono solo puede contener números.");
    } else if (name === "name" || name === "phone" || name === "city" || name === "province") {
      setErrorValidacion(null);
    }

    setFormulario((actual) => ({
      ...actual,
      [name]: name === "name" || name === "city" || name === "province"
        ? value.replace(/[^\p{L} '-]/gu, "")
        : name === "phone"
        ? value.replace(/\D/g, "")
        : value,
    }));
    if (name === "name" || name === "phone") setErrorValidacion(null);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    if (!esNombreValido(formulario.name)) {
      setErrorValidacion("El nombre completo solo puede contener letras.");
      return;
    }
    if (formulario.phone && !/^\d+$/.test(formulario.phone)) {
      setErrorValidacion("El teléfono solo puede contener números.");
      return;
    }
    if (formulario.city && !esNombreValido(formulario.city)) {
      setErrorValidacion("La ciudad solo puede contener letras.");
      return;
    }
    if (formulario.province && !esNombreValido(formulario.province)) {
      setErrorValidacion("La provincia solo puede contener letras.");
      return;
    }

    setErrorValidacion(null);
    await onGuardar({
      name: formulario.name.trim(),
      phone: formulario.phone.trim(),
      shippingAddress: {
        street: formulario.street.trim(),
        city: formulario.city.trim(),
        province: formulario.province.trim(),
        postalCode: formulario.postalCode.trim(),
      },
    });
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="cuenta-name">Nombre completo</label>
          <input className="form-control" id="cuenta-name" name="name" value={formulario.name} onChange={manejarCambio} maxLength={100} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="cuenta-email">Correo electrónico</label>
          <input className="form-control" id="cuenta-email" value={usuario.email} disabled />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="cuenta-phone">Teléfono</label>
          <input className="form-control" id="cuenta-phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={30} value={formulario.phone} onChange={manejarCambio} autoComplete="tel" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="cuenta-street">Dirección</label>
          <input className="form-control" id="cuenta-street" name="street" value={formulario.street} onChange={manejarCambio} autoComplete="street-address" />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="cuenta-city">Ciudad</label>
          <input className="form-control" id="cuenta-city" name="city" value={formulario.city} onChange={manejarCambio} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="cuenta-province">Provincia</label>
          <input className="form-control" id="cuenta-province" name="province" value={formulario.province} onChange={manejarCambio} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="cuenta-postalCode">Código postal</label>
          <input className="form-control" id="cuenta-postalCode" name="postalCode" value={formulario.postalCode} onChange={manejarCambio} />
        </div>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3 mb-0`} role={mensaje.tipo === "success" ? "status" : "alert"}>
          {mensaje.texto}
        </div>
      )}
      {errorValidacion && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {errorValidacion}
        </div>
      )}

      <button className="btn btn-primary mt-3" type="submit" disabled={enviando}>
        {enviando ? "Guardando..." : "Guardar datos"}
      </button>
    </form>
  );
}
