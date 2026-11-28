/**
 * Valida que un nombre completo contenga letras y espacios válidos, sin números.
 * @param {string} name
 * @returns {boolean}
 */
export function esNombreValido(name) {
  if (typeof name !== "string") return false;

  const nombre = name.trim();
  return (
    nombre.length > 0 &&
    nombre.length <= 100 &&
    /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(nombre)
  );
}
