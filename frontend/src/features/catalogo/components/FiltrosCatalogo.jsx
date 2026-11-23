import { FiltroCheckbox } from "./FiltroCheckbox";
import { FiltroRango } from "./FiltroRango";
import { formatearValorSpec } from "../../../shared/utils/formatearValorSpec";

/**
 * Indica si un rango tiene al menos un límite cargado.
 * @param {{ min?: number | null, max?: number | null }} [range]
 * @returns {boolean}
 */
function isRangeActive(range) {
  return range?.min != null || range?.max != null;
}

/**
 * Panel de filtros del catálogo: marca, las specs con `filter` en su definición
 * (checkbox o rango, en el orden del JSON) y precio.
 */
export function FiltrosCatalogo({
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
  onClearFilters,
}) {
  const filterableSpecs = Object.entries(specsDefinitions ?? {}).filter(
    ([, definition]) => definition.filter,
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    Object.values(selectedSpecs).some((values) => values.length > 0) ||
    Object.values(specRanges).some(isRangeActive) ||
    isRangeActive(priceRange);

  return (
    <div className="border rounded-3 bg-light p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-6 fw-bold mb-0">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm py-0"
            onClick={onClearFilters}
          >
            Limpiar
          </button>
        )}
      </div>

      <FiltroCheckbox
        title="Marca"
        options={brands}
        selected={selectedBrands}
        onToggle={onToggleBrand}
      />

      {filterableSpecs.map(([key, definition]) =>
        definition.filter === "range" ? (
          <FiltroRango
            key={key}
            title={definition.label}
            unit={definition.unit}
            value={specRanges[key]}
            onChange={(range) => onChangeSpecRange(key, range)}
          />
        ) : (
          <FiltroCheckbox
            key={key}
            title={definition.label}
            options={specOptions[key] ?? []}
            selected={selectedSpecs[key] ?? []}
            onToggle={(value) => onToggleSpec(key, value)}
            formatOption={(value) => formatearValorSpec(value, definition.unit)}
          />
        ),
      )}

      <FiltroRango
        title="Precio"
        unit="$"
        value={priceRange}
        onChange={onChangePriceRange}
      />
    </div>
  );
}
