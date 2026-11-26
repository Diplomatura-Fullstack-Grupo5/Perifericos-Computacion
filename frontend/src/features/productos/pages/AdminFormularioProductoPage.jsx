import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  actualizarProducto,
  crearProducto,
  obtenerDefinicionesSpecs,
  obtenerMarcas,
  obtenerProducto,
  obtenerValoresSpecs,
} from "../services/productosService";
import { FormularioProducto } from "../components/FormularioProducto";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";

/**
 * Obtiene lo que necesita el formulario: el producto (si se edita), las definiciones de specs,
 * las marcas y los valores de specs ya usados.
 * @param {string} [id] Id del producto a editar; sin id es un producto nuevo.
 * @returns {Promise<{ producto: object | null, definiciones: object, marcas: object, valoresSpecs: object }>}
 */
async function cargarFormulario(id) {
  const [producto, definiciones, marcas, valoresSpecs] = await Promise.all([
    id ? obtenerProducto(id) : null,
    obtenerDefinicionesSpecs(),
    obtenerMarcas(),
    obtenerValoresSpecs(),
  ]);
  return { producto, definiciones, marcas, valoresSpecs };
}

/**
 * Página para crear un producto (`/admin/productos/nuevo`) o editarlo
 * (`/admin/productos/:id/editar`). Al guardar vuelve al listado con un aviso.
 * @returns {JSX.Element}
 */
export function AdminFormularioProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clave = id ?? "nuevo";
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  const cargando = resultado.clave !== clave;
  const { datos, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;

    cargarFormulario(id)
      .then((datos) => {
        if (!ignoreResponse) setResultado({ clave: id ?? "nuevo", datos, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al cargar el formulario:", err);
        setResultado({
          clave: id ?? "nuevo",
          datos: null,
          error: "No se pudieron cargar los datos del formulario. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [id]);

  async function handleGuardar(producto) {
    setGuardando(true);
    setErrorGuardar(null);
    try {
      if (id) await actualizarProducto(Number(id), producto);
      else await crearProducto(producto);
      navigate("/admin/productos", {
        state: { aviso: { tipo: "success", texto: `Se guardó "${producto.name}".` } },
      });
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      setErrorGuardar(err.message || "No se pudo guardar el producto. Por favor, intentá de nuevo.");
      setGuardando(false);
    }
  }

  if (cargando) return <Spinner />;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (id && !datos.producto) return <MensajeVacio>Producto no encontrado.</MensajeVacio>;

  return (
    <>
      <nav aria-label="Migas de pan">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {id ? "Editar" : "Nuevo"}
          </li>
        </ol>
      </nav>
      <h1 className="fs-3 mb-3">{id ? `Editar ${datos.producto.name}` : "Nuevo producto"}</h1>

      <FormularioProducto
        key={clave}
        producto={datos.producto}
        definiciones={datos.definiciones}
        marcas={datos.marcas}
        valoresSpecs={datos.valoresSpecs}
        guardando={guardando}
        error={errorGuardar}
        onGuardar={handleGuardar}
      />
    </>
  );
}
