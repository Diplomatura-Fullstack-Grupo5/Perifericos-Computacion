import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../api/products";
import { useEffect, useState } from "react";

export function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
        />
      ))}
    </>
  );
}
