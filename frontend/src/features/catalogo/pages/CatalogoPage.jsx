import { useEffect, useState } from "react";
import { TarjetaProducto } from "../components/TarjetaProducto";
import { FiltrosCatalogo } from "../components/FiltrosCatalogo";
import { SelectorOrden } from "../components/SelectorOrden";
import {
  obtenerProductos,
  obtenerMarcas,
  obtenerOpcionesSpecs,
  obtenerDefinicionesSpecs,
} from "../services/catalogoService";
import {
  leerFiltros,
  useFiltrosCatalogo,
} from "../hooks/useFiltrosCatalogo";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";

export function CatalogoPage() {
  const { filtros, consulta, acciones } = useFiltrosCatalogo();
  const {
    category,
    sort,
    brands: selectedBrands,
    specs: selectedSpecs,
    ranges: specRanges,
    price: priceRange,
  } = filtros;

  const [resultado, setResultado] = useState({
    consulta: null,
    products: [],
    error: null,
  });
  const [specsDefinitions, setSpecsDefinitions] = useState({});
  const [brands, setBrands] = useState([]);
  const [specOptions, setSpecOptions] = useState({});

  const { products, error } = resultado;
  const loading = resultado.consulta !== consulta;

  useEffect(() => {
    let ignoreResponse = false;
    const timer = setTimeout(() => {
      obtenerProductos(leerFiltros(new URLSearchParams(consulta)))
        .then((data) => {
          if (!ignoreResponse) setResultado({ consulta, products: data, error: null });
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los productos:", err);
          setResultado({
            consulta,
            products: [],
            error: "Error al obtener los productos. Por favor, inténtalo de nuevo.",
          });
        });
    }, 300);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [consulta]);

  useEffect(() => {
    let ignoreResponse = false;
    obtenerMarcas({ category }).then((data) => {
      if (!ignoreResponse) setBrands(data);
    });
    obtenerOpcionesSpecs({ category }).then((data) => {
      if (!ignoreResponse) setSpecOptions(data);
    });

    return () => {
      ignoreResponse = true;
    };
  }, [category]);
  useEffect(() => {
    obtenerDefinicionesSpecs().then((data) => setSpecsDefinitions(data));
  }, []);

  return (
    <div className="container py-3">
      <div className="row g-3">
        {/* -------------------- Columna izquierda: Filtrado -------------------- */}
        <aside className="col-md-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm w-100 mb-2 d-md-none"
            data-bs-toggle="collapse"
            data-bs-target="#filter-panel"
            aria-controls="filter-panel"
            aria-expanded="false"
          >
            Filtros
          </button>

          <div className="collapse d-md-block" id="filter-panel">
            <FiltrosCatalogo
              key={category}
              brands={brands}
              selectedBrands={selectedBrands}
              onToggleBrand={acciones.toggleMarca}
              specsDefinitions={specsDefinitions[category]}
              specOptions={specOptions}
              selectedSpecs={selectedSpecs}
              onToggleSpec={acciones.toggleSpec}
              specRanges={specRanges}
              onChangeSpecRange={acciones.cambiarRangoSpec}
              priceRange={priceRange}
              onChangePriceRange={acciones.cambiarRangoPrecio}
              onClearFilters={acciones.limpiarFiltros}
            />
          </div>
        </aside>

        {/* -------------------- Columna derecha: Grilla de productos -------------------- */}
        <section className="col-md-9">
          {/* TODO: botones de categoría hasta que exista el navbar. Eliminar después */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {Object.keys(specsDefinitions).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${cat === category ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => acciones.cambiarCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* TODO: Fin de los botones temporales */}

          {/* Título */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-6 fw-bold mb-0">
              {category} · {products.length}{" "}
              {products.length === 1 ? "resultado" : "resultados"}
            </h2>

            <SelectorOrden sort={sort} onChange={acciones.cambiarOrden} />
          </div>

          {/* Cards de productos */}
          {loading && <Spinner />}

          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <MensajeVacio>
              No hay productos que coincidan con los filtros elegidos.
            </MensajeVacio>
          )}

          {!loading && !error && (
            <div className="row g-3">
              {products.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-4">
                  <TarjetaProducto
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    stock={product.stock}
                    specs={product.specs}
                    specsDefinitions={specsDefinitions[product.category]}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
