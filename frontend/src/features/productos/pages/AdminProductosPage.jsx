import { useEffect, useId, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import {
  eliminarProducto,
  obtenerDefinicionesSpecs,
  obtenerProductos,
} from "../services/productosService";
import { TablaProductos } from "../components/TablaProductos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";

/**
 * Listado de productos del panel de administración: búsqueda, filtro por categoría y orden por stock
 * (en la URL: `?busqueda=&categoria=&orden=`) y acceso a crear, editar y eliminar (con confirmación).
 * @returns {JSX.Element}
 */
export function AdminProductosPage() {
  const idBase = useId();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get("busqueda") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const orden = searchParams.get("orden") ?? "";
  const clave = searchParams.toString();

  const [resultado, setResultado] = useState({
    clave: null,
    productos: [],
    total: 0,
    error: null,
  });
  const [definiciones, setDefiniciones] = useState({});
  const categorias = Object.keys(definiciones);
  const [aEliminar, setAEliminar] = useState(null);
  const [aviso, setAviso] = useState(location.state?.aviso ?? null);

  const cargando = resultado.clave !== clave;
  const { productos, total, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;

    obtenerDefinicionesSpecs()
      .then((definiciones) => {
        if (!ignoreResponse) setDefiniciones(definiciones);
      })
      .catch((err) => console.error("Error al obtener las categorías:", err));

    return () => {
      ignoreResponse = true;
    };
  }, []);

  useEffect(() => {
    let ignoreResponse = false;

    obtenerProductos({ busqueda, category: categoria, sort: orden })
      .then(({ products, total }) => {
        if (!ignoreResponse) setResultado({ clave, productos: products, total, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener los productos:", err);
        setResultado({
          clave,
          productos: [],
          total: 0,
          error: "No se pudieron cargar los productos. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [clave, busqueda, categoria, orden]);

  /**
   * Cambia un filtro en la URL. Sin valor, lo quita. Reemplaza la entrada del historial para no
   * llenarlo con cada letra de la búsqueda.
   * @param {string} nombre
   * @param {string} valor
   */
  function cambiarFiltro(nombre, valor) {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(nombre, valor);
    else params.delete(nombre);
    setSearchParams(params, { replace: true });
  }

  async function handleConfirmarEliminar() {
    const producto = aEliminar;
    setAEliminar(null);
    try {
      await eliminarProducto(producto.id);
      setResultado({
        ...resultado,
        productos: productos.filter(({ id }) => id !== producto.id),
        total: total - 1,
      });
      setAviso({ tipo: "success", texto: `Se eliminó "${producto.name}".` });
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setAviso({
        tipo: "danger",
        texto: `No se pudo eliminar "${producto.name}". Por favor, intentá de nuevo.`,
      });
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="fs-3 mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Nuevo producto
        </Link>
      </div>

      {aviso && (
        <div className={`alert alert-${aviso.tipo} d-flex align-items-start`} role="status">
          <span className="flex-grow-1">{aviso.texto}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setAviso(null)}
          />
        </div>
      )}

      {/* -------------------- Búsqueda y filtro -------------------- */}
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <label htmlFor={`${idBase}-busqueda`} className="visually-hidden">
            Buscar por nombre o marca
          </label>
          <input
            id={`${idBase}-busqueda`}
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o marca"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`${idBase}-categoria`} className="visually-hidden">
            Categoría
          </label>
          <select
            id={`${idBase}-categoria`}
            className="form-select"
            value={categoria}
            onChange={(e) => cambiarFiltro("categoria", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------------------- Resultados -------------------- */}
      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {productos.length} de {total} productos
          </p>
          {productos.length === 0 ? (
            <MensajeVacio>No hay productos que coincidan con la búsqueda.</MensajeVacio>
          ) : (
            <TablaProductos
              productos={productos}
              definiciones={definiciones}
              orden={orden}
              onOrdenar={(nuevoOrden) => cambiarFiltro("orden", nuevoOrden)}
              onEliminar={setAEliminar}
            />
          )}
        </>
      )}

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar producto"
        textoConfirmar="Eliminar producto"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      >
        ¿Eliminar <strong>{aEliminar?.name}</strong>? Esta acción no se puede deshacer.
      </ModalConfirmacion>
    </>
  );
}
