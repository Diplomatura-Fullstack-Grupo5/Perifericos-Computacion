import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../api/products";
import { useEffect, useState } from "react";

export function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div className="container py-3">
      <div className="row g-3">
        {/* ----- Columna izquierda: Filtrado ----- */}
        <aside className="col-md-3">
          <div className="border rounded-3 bg-light p-3">
            <h2 className="fs-6 fw-bold mb-0">Filtros</h2>
          </div>
        </aside>

        {/* ----- Columna derecha: Grilla de productos ----- */}
        <section className="col-md-9">
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-sm-6 col-lg-4">
                <ProductCard name={product.name} price={product.price} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
