import { enviar } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";
import { esNombreValido } from "../utils/validarNombre";

const CLAVE_SESION = "puntotech-usuario";

/**
 * Registra un usuario mediante una API simulada.
 * @param {{ name: string, email: string, password: string }} usuario
 * @returns {Promise<{ id: number, name: string, email: string, role: string, createdAt: string }>}
 */
export function registrarUsuario(usuario) {
  return enviar(ENDPOINTS.registrarUsuario, usuario);
}

/**
 * Actualiza los datos personales del usuario con sesión iniciada.
 * @param {{ name: string, phone: string, shippingAddress: { street: string, city: string, province: string, postalCode: string } }} datos
 * @returns {Promise<{ id: number, name: string, email: string, phone: string, shippingAddress: object, role: string, createdAt: string }>}
 */
export async function actualizarDatosUsuario(datos) {
  const usuarioActual = obtenerSesion();
  if (!usuarioActual) throw new Error("Iniciá sesión para editar tus datos.");
  if (!esNombreValido(datos.name)) {
    throw new Error("El nombre completo solo puede contener letras.");
  }
  if (datos.phone && !/^\d+$/.test(datos.phone)) {
    throw new Error("El teléfono solo puede contener números.");
  }
  if (datos.shippingAddress?.city && !esNombreValido(datos.shippingAddress.city)) {
    throw new Error("La ciudad solo puede contener letras.");
  }
  if (datos.shippingAddress?.province && !esNombreValido(datos.shippingAddress.province)) {
    throw new Error("La provincia solo puede contener letras.");
  }

  const usuarioActualizado = await enviar(
    ENDPOINTS.usuario(usuarioActual.id),
    datos,
    "PATCH",
  );

  if (!esUsuarioValido(usuarioActualizado)) {
    throw new Error("El servicio devolvió datos de usuario inválidos.");
  }

  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioActualizado));
  return usuarioActualizado;
}

/**
 * Inicia sesión y guarda el perfil devuelto por la API en sessionStorage.
 * @param {{ email: string, password: string }} credenciales
 * @returns {Promise<{ id: number, name: string, email: string, role: string, createdAt: string }>}
 */
export async function iniciarSesion(credenciales) {
  const usuario = await enviar(ENDPOINTS.iniciarSesion, credenciales);

  if (!esUsuarioValido(usuario)) {
    throw new Error("El servicio de acceso devolvió datos de usuario inválidos.");
  }

  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  return usuario;
}

/**
 * Devuelve el perfil de la sesión actual o null si no hay una sesión válida.
 * @returns {{ id: number, name: string, email: string, phone?: string, shippingAddress?: object, role: string, createdAt: string }|null}
 */
export function obtenerSesion() {
  const sesionGuardada = sessionStorage.getItem(CLAVE_SESION);
  if (sesionGuardada === null) return null;

  let usuario;
  try {
    usuario = JSON.parse(sesionGuardada);
  } catch {
    sessionStorage.removeItem(CLAVE_SESION);
    return null;
  }

  if (!esUsuarioValido(usuario)) {
    sessionStorage.removeItem(CLAVE_SESION);
    return null;
  }

  return usuario;
}

/**
 * Elimina la sesión actual del navegador.
 * @returns {void}
 */
export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

function esUsuarioValido(usuario) {
  return (
    usuario !== null &&
    typeof usuario === "object" &&
    Number.isInteger(usuario.id) &&
    typeof usuario.name === "string" &&
    typeof usuario.email === "string" &&
    (usuario.role === "cliente" || usuario.role === "administrador")
  );
}