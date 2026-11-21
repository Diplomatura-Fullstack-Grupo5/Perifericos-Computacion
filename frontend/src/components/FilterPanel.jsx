import { CheckboxFilter } from "./CheckboxFilter";
import { formatSpecValue } from "../utils/formatSpecValue";

/**
 * Panel de filtros del catálogo: marca y las specs con `"filter": "checkbox"` en su definición.
 */
export function FilterPanel({
  brands,
  selectedBrands,
  onToggleBrand,
  specsDefinitions,
  specOptions,
  selectedSpecs,
  onToggleSpec,
}) {
  const checkboxSpecs = Object.entries(specsDefinitions ?? {}).filter(
    ([, definition]) => definition.filter === "checkbox",
  );

  return (
    <div className="border rounded-3 bg-light p-3">
      <h2 className="fs-6 fw-bold mb-3">Filtros</h2>

      <CheckboxFilter
        title="Marca"
        options={brands}
        selected={selectedBrands}
        onToggle={onToggleBrand}
      />

      {checkboxSpecs.map(([key, definition]) => (
        <CheckboxFilter
          key={key}
          title={definition.label}
          options={specOptions[key] ?? []}
          selected={selectedSpecs[key] ?? []}
          onToggle={(value) => onToggleSpec(key, value)}
          formatOption={(value) => formatSpecValue(value, definition.unit)}
        />
      ))}
    </div>
  );
}
