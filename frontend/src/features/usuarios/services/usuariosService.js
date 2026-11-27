import { enviar, pedir } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/** Roles que puede tener un usuario. */
export const ROLES_USUARIO = ["cliente", "administrador"];

/**
 * Quita de un usuario los datos que nunca deben llegar a la interfaz (el hash de la contraseña).
 * Hoy lo hace el service porque el JSON de práctica se sirve entero; la API real no los mandará.
 * @param {object} usuario
 * @returns {{ id: number, name: string, email: string, role: string, createdAt: string }}
 */
function sinDatosPrivados({ id, name, email, role, createdAt }) {
  return { id, name, email, role, createdAt };
}

/**
 * Indica si un usuario coincide con el texto buscado, por nombre o por correo.
 * @param {object} usuario
 * @param {string} texto Ya en minúsculas y sin espacios en los extremos. Vacío = coincide.
 * @returns {boolean}
 */
function coincideBusqueda(usuario, texto) {
  if (!texto) return true;
  return (
    usuario.name.toLocaleLowerCase("es").includes(texto) ||
    usuario.email.toLocaleLowerCase("es").includes(texto)
  );
}

/**
 * Obtiene los usuarios del panel que coinciden con la búsqueda y el rol, ordenados por nombre.
 * Simula `GET /api/usuarios?busqueda=&rol=` (admin).
 * @param {object} [filtros]
 * @param {string} [filtros.busqueda] Nombre o correo. Vacío = sin filtro.
 * @param {string} [filtros.rol] Uno de `ROLES_USUARIO`. Vacío = todos.
 * @returns {Promise<{ usuarios: object[], total: number, porRol: Object<string, number>,
 *   administradores: number }>} Los que coinciden, el total sin filtrar, cuántos hay de cada rol con
 *   la búsqueda elegida (sin aplicar el filtro de rol) y cuántos administradores hay en total.
 */
export async function obtenerUsuarios({ busqueda = "", rol = "" } = {}) {
  const data = (await pedir(ENDPOINTS.usuarios)).map(sinDatosPrivados);
  const texto = busqueda.trim().toLocaleLowerCase("es");

  const sinFiltroDeRol = data.filter((usuario) => coincideBusqueda(usuario, texto));

  const porRol = Object.fromEntries(
    ROLES_USUARIO.map((nombre) => [
      nombre,
      sinFiltroDeRol.filter((usuario) => usuario.role === nombre).length,
    ]),
  );

  const usuarios = sinFiltroDeRol
    .filter((usuario) => !rol || usuario.role === rol)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return {
    usuarios,
    total: data.length,
    porRol,
    administradores: data.filter((usuario) => usuario.role === "administrador").length,
  };
}

/**
 * Devuelve el rol al que pasaría un usuario con el botón de cambio de rol.
 * @param {object} usuario
 * @returns {string}
 */
export function obtenerRolSiguiente(usuario) {
  return usuario.role === "administrador" ? "cliente" : "administrador";
}

/**
 * Explica por qué no se le puede quitar el rol de administrador a un usuario: el panel siempre
 * necesita al menos un administrador.
 * @param {object} usuario
 * @param {number} administradores Cuántos administradores hay en total.
 * @returns {string | null} El motivo, o `null` si el cambio está permitido.
 */
export function obtenerMotivoSinCambioDeRol(usuario, administradores) {
  if (usuario.role === "administrador" && administradores <= 1) return "Es el único administrador.";
  return null;
}

/**
 * Cambia el rol de un usuario. Simula `PATCH /api/usuarios/:id/rol` (admin).
 * Antes de guardar vuelve a contar los administradores, como hará el backend, para no dejar el panel
 * sin ninguno aunque otro administrador haya cambiado roles mientras tanto.
 * @param {object} usuario El usuario tal como se muestra (se usa su `id` y su `role` actual).
 * @param {string} rolNuevo Uno de `ROLES_USUARIO`, distinto del actual.
 * @returns {Promise<object>} El usuario actualizado.
 * @throws {Error} Si el rol no es válido, el cambio no está permitido (sin `status`, con un mensaje
 *   para mostrar) o el servidor responde con error (con el código HTTP en `error.status`).
 */
export async function cambiarRolUsuario(usuario, rolNuevo) {
  if (!ROLES_USUARIO.includes(rolNuevo) || rolNuevo === usuario.role) {
    throw new Error(`No se puede pasar el usuario a ${rolNuevo}.`);
  }

  const data = await pedir(ENDPOINTS.usuarios);
  const actual = data.find((registro) => registro.id === usuario.id);
  if (!actual) throw new Error("El usuario ya no existe.");

  const motivo = obtenerMotivoSinCambioDeRol(
    actual,
    data.filter((registro) => registro.role === "administrador").length,
  );
  if (motivo) throw new Error(motivo);

  const actualizado = await enviar(ENDPOINTS.rolUsuario(usuario.id), { role: rolNuevo }, "PATCH");
  return sinDatosPrivados(actualizado);
}
