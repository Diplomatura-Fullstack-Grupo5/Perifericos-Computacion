import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { obtenerProducto, obtenerDefinicionesSpecs } from "../services/productosService";
import { MigasProducto } from "../components/MigasProducto";
import { ImagenProducto } from "../components/ImagenProducto";
import { InfoProducto } from "../components/InfoProducto";
import { AccionesProducto } from "../components/AccionesProducto";
import { TablaSpecs } from "../components/TablaSpecs";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";

/**
 * Obtiene el producto y las definiciones de specs de su categoría.
 * @param {string} id Id del producto.
 * @returns {Promise<{ producto: object | null, specsDefinitions: Object<string, object> }>}
 */
async function cargarFicha(id) {
  const producto = await obtenerProducto(id);
  if (!producto) return { producto: null, specsDefinitions: {} };

  const definiciones = await obtenerDefinicionesSpecs();
  return { producto, specsDefinitions: definiciones[producto.category] ?? {} };
}

/**
 * Ficha de un producto: información, precio, stock y especificaciones técnicas.
 * Lee el id de la URL (`/producto/:id`).
 * @returns {JSX.Element}
 */
export function ProductoPage() {
  const { id } = useParams();
  const [resultado, setResultado] = useState({
    id: null,
    producto: null,
    specsDefinitions: {},
    error: null,
  });

  const cargando = resultado.id !== id;
  const { producto, specsDefinitions, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;

    cargarFicha(id)
      .then(({ producto, specsDefinitions }) => {
        if (!ignoreResponse) setResultado({ id, producto, specsDefinitions, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener el producto:", err);
        setResultado({
          id,
          producto: null,
          specsDefinitions: {},
          error: "No se pudo cargar el producto. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [id]);

  if (cargando) return <Spinner />;

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!producto) return <MensajeVacio>Producto no encontrado.</MensajeVacio>;

  return (
    <div className="container py-3">
      <MigasProducto category={producto.category} name={producto.name} />

      <div className="row g-4">
        {/* -------------------- Columna izquierda: Imagen -------------------- */}
        <div className="col-md-5">
          <ImagenProducto image={producto.image} name={producto.name} />
        </div>

        {/* -------------------- Columna derecha: Información y specs -------------------- */}
        <div className="col-md-7">
          <InfoProducto
            brand={producto.brand}
            name={producto.name}
            description={producto.description}
            price={producto.price}
            stock={producto.stock}
          />
          <AccionesProducto
            id={producto.id}
            category={producto.category}
            name={producto.name}
            price={producto.price}
            image={producto.image}
            stock={producto.stock}
          />
          <TablaSpecs specs={producto.specs} specsDefinitions={specsDefinitions} />
        </div>
      </div>
    </div>
  );
}
