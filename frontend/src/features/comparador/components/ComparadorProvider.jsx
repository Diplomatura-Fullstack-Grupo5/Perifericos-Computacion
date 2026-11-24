import { ComparadorContext, MAXIMO_PRODUCTOS } from "../hooks/comparadorContext";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";

const CLAVE_LOCAL_STORAGE = "puntotech-comparador";

/**
 * Comprueba que lo guardado en localStorage sea una selección válida.
 * @param {*} valor
 * @returns {boolean}
 */
function esSeleccionValida(valor) {
  return (
    Array.isArray(valor) &&
    valor.length <= MAXIMO_PRODUCTOS &&
    valor.every(
      (producto) =>
        Number.isInteger(producto?.id) && typeof producto?.category === "string",
    )
  );
}

/**
 * Guarda los productos elegidos para comparar (hasta 4, todos de la misma categoría) y los
 * comparte con toda la aplicación. La selección se conserva en localStorage.
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function ComparadorProvider({ children }) {
  const [seleccion, setSeleccion] = useLocalStorage(
    CLAVE_LOCAL_STORAGE,
    [],
    esSeleccionValida,
  );
  const categoria = seleccion[0]?.category ?? null;

  function estaSeleccionado(id) {
    return seleccion.some((producto) => producto.id === id);
  }

  /**
   * Explica por qué un producto no se puede agregar, o `null` si se puede (o ya está elegido).
   * @param {{id: number, category: string}} producto
   * @returns {{ tipo: "categoria" | "maximo", mensaje: string } | null}
   */
  function motivoBloqueo({ id, category }) {
    if (estaSeleccionado(id)) return null;
    if (categoria && category !== categoria) {
      return {
        tipo: "categoria",
        mensaje: `Solo se comparan productos de la misma categoría (${categoria})`,
      };
    }
    if (seleccion.length >= MAXIMO_PRODUCTOS) {
      return {
        tipo: "maximo",
        mensaje: `Máximo ${MAXIMO_PRODUCTOS} productos para comparar`,
      };
    }
    return null;
  }

  function alternar({ id, category }) {
    setSeleccion((prev) => {
      if (prev.some((producto) => producto.id === id)) {
        return prev.filter((producto) => producto.id !== id);
      }
      const categoriaActual = prev[0]?.category;
      if (categoriaActual && categoriaActual !== category) return prev;
      if (prev.length >= MAXIMO_PRODUCTOS) return prev;
      return [...prev, { id, category }];
    });
  }

  function quitar(id) {
    setSeleccion((prev) => prev.filter((producto) => producto.id !== id));
  }

  function vaciar() {
    setSeleccion([]);
  }

  const valor = {
    seleccion,
    cantidad: seleccion.length,
    categoria,
    estaSeleccionado,
    motivoBloqueo,
    alternar,
    quitar,
    vaciar,
  };

  return <ComparadorContext value={valor}>{children}</ComparadorContext>;
}
