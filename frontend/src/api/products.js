export async function getProducts() {
  const response = await fetch("/data/products.json");

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  const data = await response.json();
  return data;
}
