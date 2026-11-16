import { CheckboxFilter } from "./CheckboxFilter";

export function FilterPanel({ brands, selectedBrands, onToggleBrand }) {
  return (
    <div className="border rounded-3 bg-light p-3">
      <h2 className="fs-6 fw-bold mb-3">Filtros</h2>

      <CheckboxFilter
        title="Marca"
        options={brands}
        selected={selectedBrands}
        onToggle={onToggleBrand}
      />
    </div>
  );
}
