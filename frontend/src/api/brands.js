//! Agregar un brand en productos, implica agregarlo aca tambien. Replantear en backend
export async function getBrands({ category } = {}) {
  const response = await fetch("/data/brands.json");

  if (!response.ok) {
    throw new Error("Error al obtener las marcas");
  }

  const data = await response.json();
  return data[category] ?? [];
}
