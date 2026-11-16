import { ProductCard } from "../components/ProductCard";
import { FilterPanel } from "../components/FilterPanel";
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
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort).label;

  useEffect(() => {
    getProducts({ category, sort, brands: selectedBrands }).then((data) =>
      setProducts(data),
    );
  }, [category, sort, selectedBrands]);
  useEffect(() => {
    getBrands({ category }).then((data) => setBrands(data));
  }, [category]);
  useEffect(() => {
    getSpecsDefinitions().then((data) => setSpecsDefinitions(data));
  }, []);

  function toggleBrand(brand) {
    setSelectedBrands((prevSelectedBrands) => {
      if (prevSelectedBrands.includes(brand))
        return prevSelectedBrands.filter((b) => b !== brand);
      return [...prevSelectedBrands, brand];
    });
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

            {/* Ordenar */}
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary text-decoration-none dropdown-toggle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ordenar por: {sortLabel}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`dropdown-item small ${option.value === sort ? "active" : ""}`}
                      onClick={() => setSort(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cards de productos */}
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
        </section>
      </div>
    </div>
  );
}
