import { useEffect, useState } from "react";
import { TarjetaProducto } from "../components/TarjetaProducto";
import { FiltrosCatalogo } from "../components/FiltrosCatalogo";
import { SelectorOrden } from "../components/SelectorOrden";
import { Paginacion } from "../../../shared/components/molecules/Paginacion";
import {
  PRODUCTOS_POR_PAGINA,
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
    page,
  } = filtros;

  const [resultado, setResultado] = useState({
    consulta: null,
    products: [],
    total: 0,
    error: null,
  });
  const [specsDefinitions, setSpecsDefinitions] = useState({});
  const [brands, setBrands] = useState([]);
  const [specOptions, setSpecOptions] = useState({});

  const { products, total, error } = resultado;
  const loading = resultado.consulta !== consulta;
  const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

  useEffect(() => {
    let ignoreResponse = false;
    const timer = setTimeout(() => {
      obtenerProductos(leerFiltros(new URLSearchParams(consulta)))
        .then(({ products, total }) => {
          if (!ignoreResponse) {
            setResultado({ consulta, products, total, error: null });
          }
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los productos:", err);
          setResultado({
            consulta,
            products: [],
            total: 0,
            error: "Error al obtener los productos. Por favor, intentá de nuevo.",
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

  function irAPagina(pagina) {
    acciones.cambiarPagina(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
          {/* Título */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-6 fw-bold mb-0">
              {category} · {total} {total === 1 ? "resultado" : "resultados"}
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
                    id={product.id}
                    category={product.category}
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

          {!loading && !error && (
            <Paginacion
              paginaActual={page}
              totalPaginas={totalPaginas}
              onChange={irAPagina}
            />
          )}
        </section>
      </div>
    </div>
  );
}
