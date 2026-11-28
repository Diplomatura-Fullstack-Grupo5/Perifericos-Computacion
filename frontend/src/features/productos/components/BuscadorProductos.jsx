import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerSugerencias } from "../services/productosService";
import { MINIMO_LETRAS_BUSQUEDA } from "../utils/buscarSugerencias";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./BuscadorProductos.css";

/** Milisegundos que se espera después de la última tecla antes de buscar. */
const DEMORA_BUSQUEDA_MS = 300;

/**
 * Arma el texto que se anuncia a los lectores de pantalla según el estado de la búsqueda.
 * @param {object} estado
 * @param {boolean} estado.visible Si la lista de sugerencias está abierta.
 * @param {boolean} estado.cargando
 * @param {boolean} estado.error
 * @param {number} estado.cantidad Cantidad de sugerencias.
 * @returns {string} Vacío si no hay nada que anunciar.
 */
function describirEstado({ visible, cargando, error, cantidad }) {
  if (!visible) return "";
  if (cargando) return "Buscando…";
  if (error) return "No se pudo buscar.";
  if (cantidad === 0) return "No hay sugerencias.";
  const sugerencias = cantidad === 1 ? "1 sugerencia" : `${cantidad} sugerencias`;
  return `${sugerencias}. Usá las flechas para recorrerlas y Enter para abrir una.`;
}

/**
 * Buscador del Navbar con sugerencias (patrón "combobox" de WAI-ARIA): a partir de
 * `MINIMO_LETRAS_BUSQUEDA` letras muestra hasta 6 productos con miniatura, nombre y precio.
 * Con el mouse se elige con un clic; con el teclado, ↑ y ↓ recorren la lista, Enter abre la
 * sugerencia marcada (sin ninguna marcada no hace nada) y Escape cierra la lista o, si ya está
 * cerrada, borra el texto. Elegir una sugerencia lleva a la ficha del producto y limpia el campo.
 * El foco queda siempre en el campo de texto: por eso las sugerencias cancelan `mousedown`; si no,
 * el campo perdería el foco, la lista se cerraría antes del clic y no se podría elegir nada.
 * @returns {JSX.Element}
 */
export function BuscadorProductos() {
  const navegar = useNavigate();
  const idLista = useId();
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [resultado, setResultado] = useState({ consulta: "", sugerencias: [], error: false });

  const consulta = texto.trim();
  const buscable = consulta.length >= MINIMO_LETRAS_BUSQUEDA;
  const cargando = buscable && resultado.consulta !== consulta;
  const { sugerencias, error } = resultado;
  const visible = abierto && buscable;
  const hayOpciones = visible && !cargando && !error && sugerencias.length > 0;

  useEffect(() => {
    if (!buscable) return;
    let ignoreResponse = false;

    const timer = setTimeout(() => {
      obtenerSugerencias(consulta)
        .then((data) => {
          if (!ignoreResponse) setResultado({ consulta, sugerencias: data, error: false });
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al buscar sugerencias:", err);
          setResultado({ consulta, sugerencias: [], error: true });
        });
    }, DEMORA_BUSQUEDA_MS);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [consulta, buscable]);

  function cerrar() {
    setAbierto(false);
    setIndiceActivo(-1);
  }

  /**
   * Lleva a la ficha del producto elegido y deja el buscador vacío y cerrado.
   * @param {number} id
   */
  function elegir(id) {
    setTexto("");
    cerrar();
    navegar(`/producto/${id}`);
  }

  function handleChange(e) {
    setTexto(e.target.value);
    setAbierto(true);
    setIndiceActivo(-1);
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!abierto) setAbierto(true);
        if (hayOpciones) setIndiceActivo((i) => (i + 1) % sugerencias.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (hayOpciones) setIndiceActivo((i) => (i <= 0 ? sugerencias.length - 1 : i - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (hayOpciones && indiceActivo >= 0) elegir(sugerencias[indiceActivo].id);
        break;
      case "Escape":
        e.preventDefault();
        if (visible) cerrar();
        else setTexto("");
        break;
      default:
    }
  }

  /** Cierra la lista si el foco pasa a algo que no es parte del buscador. */
  function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) cerrar();
  }

  return (
    <form
      className="buscador flex-grow-1 my-2 my-lg-0"
      role="search"
      onSubmit={(e) => e.preventDefault()}
      onBlur={handleBlur}
    >
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder="Buscar periféricos..."
        aria-label="Buscar periféricos"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={hayOpciones}
        aria-controls={idLista}
        aria-activedescendant={
          hayOpciones && indiceActivo >= 0 ? `${idLista}-${indiceActivo}` : undefined
        }
        value={texto}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setAbierto(true)}
      />

      <p className="visually-hidden" aria-live="polite">
        {describirEstado({ visible, cargando, error, cantidad: sugerencias.length })}
      </p>

      {visible && (
        <div className="buscador-lista card shadow">
          {cargando && <p className="buscador-mensaje">Buscando…</p>}

          {!cargando && error && (
            <p className="buscador-mensaje text-danger">No se pudo buscar. Intentá de nuevo.</p>
          )}

          {!cargando && !error && sugerencias.length === 0 && (
            <p className="buscador-mensaje">No encontramos productos para “{consulta}”.</p>
          )}

          <ul
            id={idLista}
            role="listbox"
            aria-label="Sugerencias de productos"
            className="list-unstyled mb-0"
            hidden={!hayOpciones}
          >
            {hayOpciones &&
              sugerencias.map(({ id, name, brand, price, image }, indice) => (
                <li
                  key={id}
                  id={`${idLista}-${indice}`}
                  role="option"
                  aria-selected={indice === indiceActivo}
                  className={`buscador-sugerencia ${indice === indiceActivo ? "buscador-sugerencia-activa" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setIndiceActivo(indice)}
                  onClick={() => elegir(id)}
                >
                  <span className="buscador-miniatura">
                    {image ? (
                      <img src={image} alt="" />
                    ) : (
                      <i className="bi bi-image text-secondary" aria-hidden="true" />
                    )}
                  </span>
                  <span className="flex-grow-1">
                    <span className="d-block small fw-semibold">{name}</span>
                    <span className="d-block small text-secondary">{brand}</span>
                  </span>
                  <span className="small fw-semibold text-primary text-nowrap">
                    {formatearPrecio(price)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </form>
  );
}
