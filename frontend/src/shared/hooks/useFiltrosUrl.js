import { useSearchParams } from "react-router";

/**
 * Filtros de una página guardados en la URL (`?busqueda=&categoria=`), para que se puedan
 * compartir y no se pierdan con el botón Atrás.
 * @returns {[URLSearchParams, (nombre: string, valor: string) => void]} Los parámetros actuales y la
 *   función que cambia uno (sin valor, lo quita). Reemplaza la entrada del historial para no
 *   llenarlo con cada letra de una búsqueda.
 */
export function useFiltrosUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  function cambiarFiltro(nombre, valor) {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(nombre, valor);
    else params.delete(nombre);
    setSearchParams(params, { replace: true });
  }

  return [searchParams, cambiarFiltro];
}
