export const SORT_OPTIONS = [
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "name_desc", label: "Nombre (Z-A)" },
];

export async function getProducts({ category, sort, brands } = {}) {
  const response = await fetch("/data/products.json");

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  const data = await response.json();

  return data
    .filter((product) => !category || product.category === category)
    .filter((product) => !brands?.length || brands.includes(product.brand))
    .sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
}
