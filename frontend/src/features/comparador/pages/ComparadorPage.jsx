import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useComparador } from "../hooks/useComparador";
import {
  obtenerProductosPorIds,
  obtenerDefinicionesSpecs,
} from "../services/comparadorService";
import { armarFilasComparacion } from "../utils/armarFilasComparacion";
import { TablaComparacion } from "../components/TablaComparacion";
import { TablaComparacionVacia } from "../components/TablaComparacionVacia";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";

const FILAS_VISIBLES = 6;

/**
 * Comparador: muestra lado a lado los productos elegidos (hasta 4, de la misma categoría),
 * marcando las specs que difieren y el mejor valor de cada una.
 * @returns {JSX.Element}
 */
export function ComparadorPage() {
  const { seleccion, categoria, quitar, vaciar } = useComparador();
  const ids = seleccion.map((producto) => producto.id);
  const clave = ids.join(",");

  const [resultado, setResultado] = useState({
    clave: null,
    productos: [],
    definiciones: {},
    error: null,
  });
  const [soloDiferencias, setSoloDiferencias] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);

  useEffect(() => {
    if (clave === "") return;
    let ignoreResponse = false;
    const idsPedidos = clave.split(",").map(Number);

    Promise.all([
      obtenerProductosPorIds(idsPedidos),
      obtenerDefinicionesSpecs(categoria),
    ])
      .then(([productos, definiciones]) => {
        if (!ignoreResponse) {
          setResultado({ clave, productos, definiciones, error: null });
        }
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener los productos a comparar:", err);
        setResultado({
          clave,
          productos: [],
          definiciones: {},
          error:
            "No se pudieron cargar los productos a comparar. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [clave, categoria]);

  const productos = ids
    .map((id) => resultado.productos.find((producto) => producto.id === id))
    .filter(Boolean);
  const cargando =
    clave !== "" && resultado.clave !== clave && productos.length < ids.length;

  const leyenda = (
    <p className="small text-secondary mt-3 mb-0">
      Borde amarillo: la especificación difiere entre productos. Verde con ★: mejor
      valor.
    </p>
  );

  if (seleccion.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="fs-5 fw-bold mb-1">Comparador</h1>
        <p className="text-secondary mb-3">
          Todavía no elegiste productos. Marcá &quot;Comparar&quot; en hasta 4
          productos de la misma categoría para verlos lado a lado.
        </p>
        <TablaComparacionVacia />
        {leyenda}
      </div>
    );
  }

  if (cargando) return <Spinner />;

  if (resultado.error && resultado.clave === clave) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {resultado.error}
        </div>
      </div>
    );
  }

  const filas = armarFilasComparacion(productos, resultado.definiciones);
  const filasFiltradas = soloDiferencias
    ? filas.filter((fila) => fila.difieren)
    : filas;
  const filasVisibles = expandido
    ? filasFiltradas
    : filasFiltradas.slice(0, FILAS_VISIBLES);
  const filasOcultas = filasFiltradas.length - filasVisibles.length;
  const linkCategoria = `/catalogo?categoria=${encodeURIComponent(categoria)}`;

  return (
    <div className="container py-4">
      {/* -------------------- Título y opciones -------------------- */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h1 className="fs-5 fw-bold mb-0">
          Comparando {productos.length}{" "}
          {productos.length === 1 ? "producto" : "productos"} · {categoria}
        </h1>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="form-check mb-0">
            <input
              id="solo-diferencias"
              type="checkbox"
              className="form-check-input"
              checked={soloDiferencias}
              disabled={productos.length < 2}
              onChange={(e) => setSoloDiferencias(e.target.checked)}
            />
            <label htmlFor="solo-diferencias" className="form-check-label small">
              Mostrar solo diferencias
            </label>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-peligro-al-pasar btn-sm"
            onClick={() => setConfirmarVaciar(true)}
          >
            <i className="bi bi-trash me-1" aria-hidden="true" />
            Vaciar comparador
          </button>
        </div>
      </div>

      <ModalConfirmacion
        abierto={confirmarVaciar}
        titulo="Vaciar comparador"
        textoConfirmar="Vaciar"
        onConfirmar={() => {
          vaciar();
          setConfirmarVaciar(false);
        }}
        onCancelar={() => setConfirmarVaciar(false)}
      >
        ¿Querés quitar los {productos.length} productos del comparador?
      </ModalConfirmacion>

      {productos.length === 1 && (
        <div className="alert alert-info small" role="status">
          Se necesitan al menos 2 productos para comparar.{" "}
          <Link to={linkCategoria}>Buscar más {categoria.toLowerCase()}</Link>
        </div>
      )}

      {/* -------------------- Tabla -------------------- */}
      {filasFiltradas.length === 0 ? (
        <MensajeVacio>
          Todos los productos tienen las mismas especificaciones.
        </MensajeVacio>
      ) : (
        <TablaComparacion productos={productos} filas={filasVisibles} onQuitar={quitar} />
      )}

      {(expandido || filasOcultas > 0) && (
        <button
          type="button"
          className="btn btn-link btn-sm text-secondary text-decoration-none px-0 mt-2"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Ver menos" : `Ver más (${filasOcultas}) especificaciones`}
        </button>
      )}

      {/* -------------------- Leyenda -------------------- */}
      {leyenda}
    </div>
  );
}
