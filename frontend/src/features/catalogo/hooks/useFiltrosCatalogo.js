import { useSearchParams } from "react-router";
import { OPCIONES_ORDEN } from "../services/catalogoService";

const CATEGORIA_POR_DEFECTO = "Mouses";
const PARAMETROS_FIJOS = [
  "categoria",
  "orden",
  "marca",
  "precio_min",
  "precio_max",
  "pagina",
];

/**
 * Agrega el valor si no está en la lista, o lo quita si ya estaba.
 * @param {Array} list
 * @param {*} value
 * @returns {Array} Una lista nueva (no modifica la original).
 */
function toggleInList(list, value) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  return [...list, value];
}

/**
 * Convierte el texto de un parámetro de la URL al tipo original del valor de una spec.
 * Ej: "true" → true · "27" → 27 · "TKL" → "TKL"
 * @param {string} texto
 * @returns {string | number | boolean}
 */
function parsearValor(texto) {
  if (texto === "true") return true;
  if (texto === "false") return false;
  if (texto.trim() !== "" && !Number.isNaN(Number(texto))) return Number(texto);
  return texto;
}

/**
 * Convierte un límite de rango de la URL en un número de 0 en adelante.
 * Devuelve null si falta o no es un número (ej. `?precio_min=abc`).
 * @param {string | null} texto
 * @returns {number | null}
 */
function aNumeroONull(texto) {
  if (texto === null || texto === "") return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? Math.max(0, numero) : null;
}

/**
 * Lee los filtros del catálogo desde los parámetros de la URL.
 * Formato: `categoria`, `orden`, `marca` (repetible), `precio_min`, `precio_max`, `pagina`,
 * `<spec>=<valor>` (repetible) para specs de checkbox y `<spec>_min` / `<spec>_max` para rangos.
 * @param {URLSearchParams} params
 * @returns {{ category: string, sort: string, brands: string[], specs: Object<string, Array>,
 *   ranges: Object<string, {min: number|null, max: number|null}>, price: {min: number|null, max: number|null},
 *   page: number }}
 */
export function leerFiltros(params) {
  const specs = {};
  const ranges = {};

  for (const [clave, valor] of params) {
    if (PARAMETROS_FIJOS.includes(clave)) continue;

    const rango = clave.match(/^(.+)_(min|max)$/);
    if (rango) {
      const [, key, limite] = rango;
      ranges[key] ??= { min: null, max: null };
      ranges[key][limite] = aNumeroONull(valor);
    } else {
      specs[clave] ??= [];
      specs[clave].push(parsearValor(valor));
    }
  }

  return {
    category: params.get("categoria") ?? CATEGORIA_POR_DEFECTO,
    sort: params.get("orden") ?? OPCIONES_ORDEN[0].value,
    brands: params.getAll("marca"),
    specs,
    ranges,
    price: {
      min: aNumeroONull(params.get("precio_min")),
      max: aNumeroONull(params.get("precio_max")),
    },
    page: Math.max(1, Number(params.get("pagina")) || 1),
  };
}

/**
 * @param {URLSearchParams} params
 * @param {string} clave
 * @param {number | null} valor
 */
function asignarNumero(params, clave, valor) {
  if (valor === null) params.delete(clave);
  else params.set(clave, String(valor));
}

/**
 * Filtros del catálogo guardados en la URL (`?categoria=Mouses&marca=Razer&...`), para que un
 * link conserve la búsqueda y funcionen "atrás" y recargar.
 * @returns {{ filtros: ReturnType<typeof leerFiltros>, consulta: string, acciones: object }}
 *   `consulta` es la URL de filtros como texto: cambia solo cuando cambia algún filtro.
 */
export function useFiltrosCatalogo() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Cambia los filtros y vuelve a la primera página.
   * @param {(params: URLSearchParams) => void} modificar Cambia una copia de los parámetros.
   * @param {object} [opciones] `{ replace: true }` para no agregar una entrada al historial.
   */
  function actualizar(modificar, opciones) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("pagina");
      modificar(params);
      return params;
    }, opciones);
  }

  /**
   * Agrega o quita un valor de un parámetro repetible (ej. `marca=Razer&marca=Logitech`).
   * @param {URLSearchParams} params
   * @param {string} clave
   * @param {*} valor
   */
  function cambiarListaParametro(params, clave, valor) {
    const actuales = params.getAll(clave);
    params.delete(clave);
    toggleInList(actuales, String(valor)).forEach((v) => params.append(clave, v));
  }

  const acciones = {
    cambiarCategoria(categoria) {
      setSearchParams((prev) => {
        const params = new URLSearchParams({ categoria });
        if (prev.has("orden")) params.set("orden", prev.get("orden"));
        return params;
      });
    },
    cambiarPagina(pagina) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (pagina <= 1) params.delete("pagina");
        else params.set("pagina", String(pagina));
        return params;
      });
    },
    cambiarOrden(orden) {
      actualizar((params) => params.set("orden", orden));
    },
    toggleMarca(marca) {
      actualizar((params) => cambiarListaParametro(params, "marca", marca));
    },
    toggleSpec(key, valor) {
      actualizar((params) => cambiarListaParametro(params, key, valor));
    },
    cambiarRangoSpec(key, { min, max }) {
      actualizar(
        (params) => {
          asignarNumero(params, `${key}_min`, min);
          asignarNumero(params, `${key}_max`, max);
        },
        { replace: true },
      );
    },
    cambiarRangoPrecio({ min, max }) {
      actualizar(
        (params) => {
          asignarNumero(params, "precio_min", min);
          asignarNumero(params, "precio_max", max);
        },
        { replace: true },
      );
    },
    limpiarFiltros() {
      setSearchParams((prev) => {
        const params = new URLSearchParams();
        if (prev.has("categoria")) params.set("categoria", prev.get("categoria"));
        if (prev.has("orden")) params.set("orden", prev.get("orden"));
        return params;
      });
    },
  };

  return {
    filtros: leerFiltros(searchParams),
    consulta: searchParams.toString(),
    acciones,
  };
}
