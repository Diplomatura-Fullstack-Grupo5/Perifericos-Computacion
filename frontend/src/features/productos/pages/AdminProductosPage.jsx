import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  eliminarProducto,
  obtenerDefinicionesSpecs,
  obtenerProductos,
  PRODUCTOS_POR_PAGINA_PANEL,
} from "../services/productosService";
import { TablaProductos } from "../components/TablaProductos";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { Aviso } from "../../../shared/components/molecules/Aviso";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { Paginacion } from "../../../shared/components/molecules/Paginacion";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";
import { useFiltrosUrl } from "../../../shared/hooks/useFiltrosUrl";

/**
 * Listado de productos del panel de administración: búsqueda, filtro por categoría y orden por stock
 * (en la URL: `?busqueda=&categoria=&orden=&pagina=`) y acceso a crear, editar y eliminar (con confirmación).
 * @returns {JSX.Element}
 */
export function AdminProductosPage() {
  const location = useLocation();
  const { searchParams, consulta, cambiarFiltro, cambiarPagina } = useFiltrosUrl();
  const busqueda = searchParams.get("busqueda") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const orden = searchParams.get("orden") ?? "";
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);

  const [resultado, setResultado] = useState({
    consulta: null,
    productos: [],
    total: 0,
    error: null,
  });
  const [definiciones, setDefiniciones] = useState({});
  const categorias = Object.keys(definiciones);
  const [aEliminar, setAEliminar] = useState(null);
  const [aviso, setAviso] = useState(location.state?.aviso ?? null);

  const cargando = resultado.consulta !== consulta;
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
    const timer = setTimeout(() => {
      obtenerProductos({ busqueda, category: categoria, sort: orden, page: pagina })
        .then(({ products, total }) => {
          if (!ignoreResponse) setResultado({ consulta, productos: products, total, error: null });
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los productos:", err);
          setResultado({
            consulta,
            productos: [],
            total: 0,
            error: "No se pudieron cargar los productos. Por favor, intentá de nuevo.",
          });
        });
    }, 300);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [consulta, busqueda, categoria, orden, pagina]);

  function irAPagina(numero) {
    cambiarPagina(numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirmarEliminar() {
    const producto = aEliminar;
    setAEliminar(null);
    try {
      await eliminarProducto(producto.id);
      setResultado((prev) => ({
        ...prev,
        productos: prev.productos.filter(({ id }) => id !== producto.id),
        total: prev.total - 1,
      }));
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
        <Aviso tipo={aviso.tipo} onCerrar={() => setAviso(null)}>
          {aviso.texto}
        </Aviso>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <label htmlFor="productos-busqueda" className="visually-hidden">
            Buscar por nombre o marca
          </label>
          <input
            id="productos-busqueda"
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o marca"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="productos-categoria" className="visually-hidden">
            Categoría
          </label>
          <select
            id="productos-categoria"
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

      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {total} {total === 1 ? "producto" : "productos"}
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
          <Paginacion
            paginaActual={pagina}
            totalPaginas={Math.ceil(total / PRODUCTOS_POR_PAGINA_PANEL)}
            onChange={irAPagina}
          />
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
