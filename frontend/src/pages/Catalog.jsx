import { ProductCard } from "../components/ProductCard";
import { FilterPanel } from "../components/FilterPanel";
import { SortDropdown } from "../components/SortDropdown";
import { getProducts, SORT_OPTIONS } from "../api/products";
import { getSpecsDefinitions } from "../api/specsDefinitions";
import { getBrands } from "../api/brands";
import { useEffect, useState } from "react";

export function Catalog() {
  const [category, setCategory] = useState("Mouses"); //! Temporal hasta el navbar
  const [products, setProducts] = useState([]);
  const [specsDefinitions, setSpecsDefinitions] = useState({});
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ category, sort, brands: selectedBrands })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al obtener los productos:", err);
        setError(
          "Error al obtener los productos. Por favor, inténtalo de nuevo.",
        );
      })
      .finally(() => setLoading(false));
  }, [category, sort, selectedBrands]);
  useEffect(() => {
    getBrands({ category }).then((data) => setBrands(data));
  }, [category]);
  useEffect(() => {
    getSpecsDefinitions().then((data) => setSpecsDefinitions(data));
  }, []);

  function toggleBrand(brand) {
    setLoading(true);
    setSelectedBrands((prevSelectedBrands) => {
      if (prevSelectedBrands.includes(brand))
        return prevSelectedBrands.filter((b) => b !== brand);
      return [...prevSelectedBrands, brand];
    });
  }

  function changeSort(value) {
    setLoading(true);
    setSort(value);
  }

  return (
    <div className="container py-3">
      <div className="row g-3">
        {/* -------------------- Columna izquierda: Filtrado -------------------- */}
        <aside className="col-md-3">
          <FilterPanel
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={toggleBrand}
          />
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
                  setLoading(true);
                  setCategory(cat);
                  setSelectedBrands([]);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* TODO:Fin de lo temporal */}

          {/* Título */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-6 fw-bold mb-0">
              {category} · {products.length}{" "}
              {products.length === 1 ? "resultado" : "resultados"}
            </h2>

            <SortDropdown sort={sort} onChange={changeSort} />
          </div>

          {/* Cards de productos */}
          {loading && (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-secondary text-center my-5">
              No hay productos que coincidan con los filtros elegidos.
            </p>
          )}

          {!loading && !error && (
            <div className="row g-3">
              {products.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-4">
                  <ProductCard
                    name={product.name}
                    price={product.price}
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
