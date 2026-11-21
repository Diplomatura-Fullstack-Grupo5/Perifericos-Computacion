/**
 * Convierte el valor de una spec en el texto a mostrar.
 * Ej: (60, "g") → "60 g" · (27, '"') → '27"' · (true) → "Sí"
 * @param {*} value Valor de la spec.
 * @param {string} [unit] Unidad de la spec.
 * @returns {string}
 */
export function formatSpecValue(value, unit) {
  switch (typeof value) {
    case "boolean":
      return value ? "Sí" : "No";
    case "number": {
      const formattedValue = value.toLocaleString("es-AR");
      if (unit === '"') return `${formattedValue}${unit}`;
      if (unit != null) return `${formattedValue} ${unit}`;
      return formattedValue;
    }
    default:
      return value;
  }
}
