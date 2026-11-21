import { CheckboxFilter } from "./CheckboxFilter";
import { RangeFilter } from "./RangeFilter";
import { formatSpecValue } from "../utils/formatSpecValue";

/**
 * Panel de filtros del catálogo: marca, las specs con `filter` en su definición
 * (checkbox o rango, en el orden del JSON) y precio.
 */
export function FilterPanel({
  brands,
  selectedBrands,
  onToggleBrand,
  specsDefinitions,
  specOptions,
  selectedSpecs,
  onToggleSpec,
  specRanges,
  onChangeSpecRange,
  priceRange,
  onChangePriceRange,
}) {
  const filterableSpecs = Object.entries(specsDefinitions ?? {}).filter(
    ([, definition]) => definition.filter,
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

      {filterableSpecs.map(([key, definition]) =>
        definition.filter === "range" ? (
          <RangeFilter
            key={key}
            title={definition.label}
            unit={definition.unit}
            value={specRanges[key]}
            onChange={(range) => onChangeSpecRange(key, range)}
          />
        ) : (
          <CheckboxFilter
            key={key}
            title={definition.label}
            options={specOptions[key] ?? []}
            selected={selectedSpecs[key] ?? []}
            onToggle={(value) => onToggleSpec(key, value)}
            formatOption={(value) => formatSpecValue(value, definition.unit)}
          />
        ),
      )}

      <RangeFilter
        title="Precio"
        unit="$"
        value={priceRange}
        onChange={onChangePriceRange}
      />
    </div>
  );
}
