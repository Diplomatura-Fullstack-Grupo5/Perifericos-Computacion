/** Texto (en singular y plural) y color (clases de Bootstrap) de cada rol. */
const ROLES = {
  cliente: { texto: "Cliente", plural: "Clientes", clases: "text-bg-light border" },
  administrador: { texto: "Administrador", plural: "Administradores", clases: "text-bg-primary" },
};

/**
 * Devuelve el texto y las clases de la etiqueta (`badge`) de un rol.
 * @param {string} rol `"cliente"` o `"administrador"`.
 * @returns {{ texto: string, plural: string, clases: string }}
 */
export function formatearRol(rol) {
  return ROLES[rol] ?? { texto: rol, plural: rol, clases: "text-bg-light border" };
}
