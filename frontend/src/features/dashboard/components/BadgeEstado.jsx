/** Texto y color de cada estado de pedido. */
const ESTADOS = {
  pendiente: { texto: "Pendiente", clases: "text-bg-warning" },
  enviado: { texto: "Enviado", clases: "text-bg-primary" },
  entregado: { texto: "Entregado", clases: "text-bg-success" },
  cancelado: { texto: "Cancelado", clases: "text-bg-secondary" },
};

/**
 * Etiqueta con el estado de un pedido, con su texto y su color.
 * @param {object} props
 * @param {string} props.estado `"pendiente"`, `"enviado"`, `"entregado"` o `"cancelado"`.
 * @returns {JSX.Element}
 */
export function BadgeEstado({ estado }) {
  const { texto, clases } = ESTADOS[estado] ?? { texto: estado, clases: "text-bg-light" };
  return <span className={`badge ${clases}`}>{texto}</span>;
}
