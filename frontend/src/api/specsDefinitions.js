export async function getSpecsDefinitions() {
  const response = await fetch("/data/specsDefinitions.json");

  if (!response.ok) {
    throw new Error("Error al obtener las especificaciones");
  }

  const data = await response.json();
  return data;
}
