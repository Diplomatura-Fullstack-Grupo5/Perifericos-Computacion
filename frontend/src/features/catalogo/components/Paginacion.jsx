/**
 * Botones "Anterior / 1 2 3 / Siguiente". No se muestra si hay una sola página.
 * @param {object} props
 * @param {number} props.paginaActual Página actual, empezando en 1.
 * @param {number} props.totalPaginas
 * @param {(pagina: number) => void} props.onChange Se llama con la página elegida.
 */
export function Paginacion({ paginaActual, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav aria-label="Páginas de productos" className="mt-4">
      <ul className="pagination pagination-sm justify-content-center mb-0">
        <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onChange(paginaActual - 1)}
          >
            Anterior
          </button>
        </li>

        {paginas.map((pagina) => (
          <li
            key={pagina}
            className={`page-item ${pagina === paginaActual ? "active" : ""}`}
            aria-current={pagina === paginaActual ? "page" : undefined}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onChange(pagina)}
            >
              {pagina}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => onChange(paginaActual + 1)}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
}
