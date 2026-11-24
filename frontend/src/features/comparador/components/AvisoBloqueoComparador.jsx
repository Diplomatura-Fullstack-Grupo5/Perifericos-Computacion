import { useNavigate } from "react-router";
import { useComparador } from "../hooks/useComparador";
import { MAXIMO_PRODUCTOS } from "../hooks/comparadorContext";
import { Modal } from "../../../shared/components/molecules/Modal";

/**
 * Modal que explica por qué no se puede agregar un producto al comparador y qué hacer:
 * ir al comparador, o (si es de otra categoría) vaciar el comparador para empezar de nuevo.
 * @param {object} props
 * @param {{ tipo: "categoria" | "maximo", mensaje: string } | null} props.bloqueo
 *   El resultado de `motivoBloqueo`. Sin bloqueo, el modal no se muestra.
 * @param {string} props.categoriaProducto Categoría del producto que se quiso agregar.
 * @param {boolean} props.abierto
 * @param {() => void} props.onCerrar
 * @returns {JSX.Element | null}
 */
export function AvisoBloqueoComparador({
  bloqueo,
  categoriaProducto,
  abierto,
  onCerrar,
}) {
  const { cantidad, categoria, vaciar } = useComparador();
  const navigate = useNavigate();

  if (!bloqueo) return null;

  const esCategoria = bloqueo.tipo === "categoria";

  function irAlComparador() {
    onCerrar();
    navigate("/comparador");
  }

  function vaciarComparador() {
    vaciar();
    onCerrar();
  }

  return (
    <Modal
      abierto={abierto}
      titulo={
        esCategoria
          ? "Solo se comparan productos de la misma categoría"
          : `Ya elegiste ${MAXIMO_PRODUCTOS} productos para comparar`
      }
      onCerrar={onCerrar}
      pie={
        <>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCerrar}
            autoFocus
          >
            Cancelar
          </button>
          {esCategoria && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-peligro-al-pasar"
              onClick={vaciarComparador}
            >
              <i className="bi bi-trash me-1" aria-hidden="true" />
              Vaciar comparador
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={irAlComparador}>
            Ir al comparador
          </button>
        </>
      }
    >
      {esCategoria ? (
        <p className="mb-0">
          Tenés {cantidad} {cantidad === 1 ? "producto" : "productos"} de{" "}
          <strong>{categoria}</strong> en el comparador. Para comparar{" "}
          {categoriaProducto.toLowerCase()}, vaciá el comparador o quitá esos productos
          desde el comparador.
        </p>
      ) : (
        <p className="mb-0">
          Podés comparar hasta {MAXIMO_PRODUCTOS} productos a la vez. Quitá alguno desde
          el comparador para agregar este.
        </p>
      )}
    </Modal>
  );
}
