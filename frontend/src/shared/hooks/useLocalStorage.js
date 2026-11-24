import { useEffect, useState } from "react";

/**
 * Lee un valor guardado en localStorage.
 * @param {string} clave
 * @param {*} valorInicial Se usa si no hay nada guardado, si no se puede leer o si no es válido.
 * @param {(valor: *) => boolean} validar
 * @returns {*}
 */
function leerGuardado(clave, valorInicial, validar) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === null) return valorInicial;
    const valor = JSON.parse(guardado);
    return validar(valor) ? valor : valorInicial;
  } catch {
    return valorInicial;
  }
}

/**
 * Como `useState`, pero el valor se guarda en localStorage y sobrevive a recargar la página.
 * @param {string} clave Nombre con el que se guarda en localStorage.
 * @param {*} valorInicial Valor si no hay nada guardado (o lo guardado no es válido).
 * @param {(valor: *) => boolean} [validar] Comprueba que lo guardado tenga la forma esperada.
 * @returns {[*, Function]} El valor y la función para cambiarlo, igual que `useState`.
 */
export function useLocalStorage(clave, valorInicial, validar = () => true) {
  const [valor, setValor] = useState(() =>
    leerGuardado(clave, valorInicial, validar),
  );

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (err) {
      console.warn(`No se pudo guardar "${clave}" en localStorage:`, err);
    }
  }, [clave, valor]);

  return [valor, setValor];
}
