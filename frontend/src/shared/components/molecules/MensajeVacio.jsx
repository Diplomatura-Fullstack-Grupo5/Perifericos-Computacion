/**
 * Mensaje centrado para cuando una lista no tiene elementos.
 * @param {object} props
 * @param {import("react").ReactNode} props.children Texto del mensaje.
 */
export function MensajeVacio({ children }) {
  return <p className="text-secondary text-center my-5">{children}</p>;
}
