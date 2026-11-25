import { useId, useState } from "react";
import { Link } from "react-router";
import { CampoSpec } from "./CampoSpec";
import {
  armarSpecsVacias,
  formularioAProducto,
  productoAFormulario,
} from "../utils/formularioProducto";

/**
 * Formulario de alta y modificación de un producto. Los campos de especificaciones se generan a
 * partir de las definiciones de la categoría elegida; al cambiar de categoría se vacían.
 * Valida con la validación nativa del navegador y muestra los errores junto a cada campo.
 * @param {object} props
 * @param {object | null} [props.producto] Producto a modificar; `null` para uno nuevo.
 * @param {Object<string, Object<string, object>>} props.definiciones Definiciones de specs por categoría.
 * @param {Object<string, string[]>} props.marcas Marcas por categoría.
 * @param {Object<string, Object<string, string[]>>} props.valoresSpecs Valores de texto ya usados, por categoría y spec.
 * @param {boolean} props.guardando Deshabilita el botón mientras se guarda.
 * @param {string | null} [props.error] Error al guardar, para mostrar arriba de los botones.
 * @param {(producto: object) => void} props.onGuardar Recibe el producto listo para guardar.
 * @returns {JSX.Element}
 */
export function FormularioProducto({
  producto = null,
  definiciones,
  marcas,
  valoresSpecs,
  guardando,
  error = null,
  onGuardar,
}) {
  const idBase = useId();
  const [formulario, setFormulario] = useState(() => productoAFormulario(producto));
  const [validado, setValidado] = useState(false);

  const categorias = Object.keys(definiciones);
  const definicionesCategoria = definiciones[formulario.category] ?? {};
  const marcasCategoria = marcas[formulario.category] ?? [];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function handleCambiarCategoria(e) {
    const category = e.target.value;
    setFormulario({
      ...formulario,
      category,
      brand: "",
      specs: armarSpecsVacias(definiciones[category]),
    });
  }

  function handleCambiarSpec(clave, value) {
    setFormulario({ ...formulario, specs: { ...formulario.specs, [clave]: value } });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      setValidado(true);
      return;
    }
    onGuardar(formularioAProducto(formulario, definicionesCategoria));
  }

  return (
    <form
      className={`card card-body ${validado ? "was-validated" : ""}`}
      noValidate
      onSubmit={handleSubmit}
    >
      {/* -------------------- Datos generales -------------------- */}
      <fieldset className="row g-3 mb-4">
        <legend className="fs-5">Datos generales</legend>
        <p className="form-text mt-0">Todos los datos generales son obligatorios.</p>

        <div className="col-12">
          <label htmlFor={`${idBase}-name`} className="form-label">
            Nombre
          </label>
          <input
            id={`${idBase}-name`}
            name="name"
            type="text"
            className="form-control"
            required
            maxLength={120}
            value={formulario.name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá el nombre del producto.</div>
        </div>

        <div className="col-12">
          <label htmlFor={`${idBase}-description`} className="form-label">
            Descripción
          </label>
          <textarea
            id={`${idBase}-description`}
            name="description"
            className="form-control"
            rows={2}
            required
            maxLength={300}
            value={formulario.description}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá una descripción breve.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor={`${idBase}-category`} className="form-label">
            Categoría
          </label>
          <select
            id={`${idBase}-category`}
            name="category"
            className="form-select"
            required
            value={formulario.category}
            onChange={handleCambiarCategoria}
          >
            <option value="">Elegí una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Elegí la categoría.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor={`${idBase}-brand`} className="form-label">
            Marca
          </label>
          <select
            id={`${idBase}-brand`}
            name="brand"
            className="form-select"
            required
            disabled={!formulario.category}
            value={formulario.brand}
            onChange={handleChange}
          >
            <option value="">
              {formulario.category ? "Elegí una marca" : "Primero elegí la categoría"}
            </option>
            {marcasCategoria.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Elegí la marca.</div>
        </div>

        <div className="col-md-6">
          <label htmlFor={`${idBase}-price`} className="form-label">
            Precio
          </label>
          <div className="input-group has-validation">
            <span className="input-group-text">$</span>
            <input
              id={`${idBase}-price`}
              name="price"
              type="number"
              className="form-control"
              required
              min="1"
              step="1"
              value={formulario.price}
              onChange={handleChange}
            />
            <div className="invalid-feedback">Ingresá un precio entero mayor a 0.</div>
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor={`${idBase}-stock`} className="form-label">
            Stock
          </label>
          <input
            id={`${idBase}-stock`}
            name="stock"
            type="number"
            className="form-control"
            required
            min="0"
            step="1"
            value={formulario.stock}
            onChange={handleChange}
          />
          <div className="invalid-feedback">Ingresá las unidades disponibles (0 o más).</div>
        </div>

        <div className="col-12">
          <label htmlFor={`${idBase}-image`} className="form-label">
            Imagen
          </label>
          <input
            id={`${idBase}-image`}
            name="image"
            type="text"
            className="form-control"
            required
            pattern="/images/products/.+\.webp"
            placeholder="/images/products/mouse-1.webp"
            aria-describedby={`${idBase}-image-ayuda`}
            value={formulario.image}
            onChange={handleChange}
          />
          <div id={`${idBase}-image-ayuda`} className="form-text">
            Ruta de una imagen .webp de <code>public/images/products/</code>, con fondo blanco o
            transparente.
          </div>
          <div className="invalid-feedback">
            Ingresá una ruta del tipo /images/products/nombre.webp.
          </div>
        </div>
      </fieldset>

      {/* -------------------- Especificaciones técnicas -------------------- */}
      <fieldset className="row g-3 mb-4">
        <legend className="fs-5">Especificaciones técnicas</legend>
        {formulario.category ? (
          <>
            <p className="form-text mt-0">
              Dejá vacío un campo si la especificación no aplica a este producto.
            </p>
            {Object.entries(definicionesCategoria).map(([clave, definicion]) => (
              <CampoSpec
                key={clave}
                id={`${idBase}-spec-${clave}`}
                definicion={definicion}
                value={formulario.specs[clave] ?? ""}
                sugerencias={valoresSpecs[formulario.category]?.[clave]}
                onChange={(value) => handleCambiarSpec(clave, value)}
              />
            ))}
          </>
        ) : (
          <p className="text-secondary mb-0">
            Elegí una categoría para cargar sus especificaciones.
          </p>
        )}
      </fieldset>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* -------------------- Acciones -------------------- */}
      <div className="d-flex gap-2 justify-content-end">
        <Link to="/admin/productos" className="btn btn-outline-secondary">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando && (
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          )}
          Guardar producto
        </button>
      </div>
    </form>
  );
}
