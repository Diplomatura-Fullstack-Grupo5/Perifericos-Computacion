import { ProductCard } from "../components/ProductCard";
import { getProducts, SORT_OPTIONS } from "../api/products";
import { getSpecsDefinitions } from "../api/specsDefinitions";
import { useEffect, useState } from "react";

export function Catalog() {
  const [category, setCategory] = useState("Mouses"); //! Temporal hasta el navbar
  const [products, setProducts] = useState([]);
  const [specsDefinitions, setSpecsDefinitions] = useState({});
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort).label;

  useEffect(() => {
    getProducts({ category, sort }).then((data) => setProducts(data));
  }, [category, sort]);
  useEffect(() => {
    getSpecsDefinitions().then((data) => setSpecsDefinitions(data));
  }, []);

  return (
    <div className="container py-3">
      <div className="row g-3">
        {/* -------------------- Columna izquierda: Filtrado -------------------- */}
        <aside className="col-md-3">
          <div className="border rounded-3 bg-light p-3">
            <h2 className="fs-6 fw-bold mb-0">Filtros</h2>
          </div>
        </aside>

        {/* -------------------- Columna derecha: Grilla de productos -------------------- */}
        <section className="col-md-9">
          {/*! Temporal: botones de categoría hasta que exista el navbar. Eliminar después */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {Object.keys(specsDefinitions).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${cat === category ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/*! Fin de lo temporal */}

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
