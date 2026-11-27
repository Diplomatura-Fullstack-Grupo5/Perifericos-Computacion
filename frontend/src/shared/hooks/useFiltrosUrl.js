import { useSearchParams } from "react-router";

/**
 * Filtros y página de un listado guardados en la URL (`?busqueda=&pagina=2`), para que un link
 * conserve la búsqueda y funcionen "atrás" y recargar. Sigue el mismo criterio que
 * `useFiltrosCatalogo`: cambiar un filtro vuelve a la primera página.
 * @returns {{ searchParams: URLSearchParams, consulta: string,
 *   cambiarFiltro: (nombre: string, valor: string) => void, cambiarPagina: (pagina: number) => void }}
 *   `consulta` es la URL de filtros como texto: cambia solo cuando cambia algún filtro o la página.
 */
export function useFiltrosUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Cambia un filtro (sin valor, lo quita) y vuelve a la primera página. Reemplaza la entrada del
   * historial para no llenarlo con cada letra de una búsqueda.
   * @param {string} nombre
   * @param {string} valor
   */
  function cambiarFiltro(nombre, valor) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete("pagina");
        if (valor) params.set(nombre, valor);
        else params.delete(nombre);
        return params;
      },
      { replace: true },
    );
  }

  /** @param {number} pagina Empezando en 1. */
  function cambiarPagina(pagina) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (pagina <= 1) params.delete("pagina");
      else params.set("pagina", String(pagina));
      return params;
    });
  }

  return { searchParams, consulta: searchParams.toString(), cambiarFiltro, cambiarPagina };
}
