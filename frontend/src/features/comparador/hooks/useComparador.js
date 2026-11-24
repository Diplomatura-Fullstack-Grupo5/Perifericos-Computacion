import { useContext } from "react";
import { ComparadorContext } from "./comparadorContext";

/**
 * Da acceso a la selección del comparador y a sus acciones.
 * @returns {{
 *   seleccion: {id: number, category: string}[],
 *   cantidad: number,
 *   categoria: string | null,
 *   estaSeleccionado: (id: number) => boolean,
 *   motivoBloqueo: (producto: {id: number, category: string}) =>
 *     { tipo: "categoria" | "maximo", mensaje: string } | null,
 *   alternar: (producto: {id: number, category: string}) => void,
 *   quitar: (id: number) => void,
 *   vaciar: () => void,
 * }}
 * @throws {Error} Si se usa fuera de `<ComparadorProvider>`.
 */
export function useComparador() {
  const contexto = useContext(ComparadorContext);
  if (!contexto) {
    throw new Error("useComparador debe usarse dentro de <ComparadorProvider>");
  }
  return contexto;
}
