import { useEffect, useState } from "react";
import { TarjetaProducto } from "../components/TarjetaProducto";
import { FiltrosCatalogo } from "../components/FiltrosCatalogo";
import { SelectorOrden } from "../components/SelectorOrden";
import {
  OPCIONES_ORDEN,
  obtenerProductos,
  obtenerMarcas,
  obtenerOpcionesSpecs,
  obtenerDefinicionesSpecs,
} from "../services/catalogoService";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";

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

export function CatalogoPage() {
  const [category, setCategory] = useState("Mouses"); //! Temporal hasta el navbar
  const [products, setProducts] = useState([]);
  const [specsDefinitions, setSpecsDefinitions] = useState({});
  const [sort, setSort] = useState(OPCIONES_ORDEN[0].value);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [specOptions, setSpecOptions] = useState({});
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [specRanges, setSpecRanges] = useState({});
  const [priceRange, setPriceRange] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignoreResponse = false;
    const timer = setTimeout(() => {
      obtenerProductos({
        category,
        sort,
        brands: selectedBrands,
        specs: selectedSpecs,
        ranges: specRanges,
        price: priceRange,
      })
        .then((data) => {
          if (ignoreResponse) return;
          setProducts(data);
          setError(null);
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los productos:", err);
          setError(
            "Error al obtener los productos. Por favor, inténtalo de nuevo.",
          );
        })
        .finally(() => {
          if (!ignoreResponse) setLoading(false);
        });
    }, 300);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [category, sort, selectedBrands, selectedSpecs, specRanges, priceRange]);

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

  function toggleBrand(brand) {
    setLoading(true);
    setSelectedBrands((prev) => toggleInList(prev, brand));
  }

  function toggleSpec(key, value) {
    setLoading(true);
    setSelectedSpecs((prev) => ({
      ...prev,
      [key]: toggleInList(prev[key] ?? [], value),
    }));
  }

  function changeSpecRange(key, range) {
    setLoading(true);
    setSpecRanges((prev) => ({ ...prev, [key]: range }));
  }

  function changePriceRange(range) {
    setLoading(true);
    setPriceRange(range);
  }

  function changeSort(value) {
    setLoading(true);
    setSort(value);
  }

  function clearFilters() {
    setLoading(true);
    setSelectedBrands([]);
    setSelectedSpecs({});
    setSpecRanges({});
    setPriceRange({});
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
              onToggleBrand={toggleBrand}
              specsDefinitions={specsDefinitions[category]}
              specOptions={specOptions}
              selectedSpecs={selectedSpecs}
              onToggleSpec={toggleSpec}
              specRanges={specRanges}
              onChangeSpecRange={changeSpecRange}
              priceRange={priceRange}
              onChangePriceRange={changePriceRange}
              onClearFilters={clearFilters}
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
                onClick={() => {
                  setCategory(cat);
                  clearFilters();
                }}
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

            <SelectorOrden sort={sort} onChange={changeSort} />
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
