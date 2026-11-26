import { Link } from "react-router";
import { formatearPrecio } from "../../../shared/utils/formatearPrecio";
import "./DetallePedido.css";

/**
 * Productos de un pedido, con el precio que tenían al momento de la compra, y el total.
 * @param {object} props
 * @param {object} props.pedido
 * @returns {JSX.Element}
 */
export function DetallePedido({ pedido }) {
  return (
    <table className="table table-sm table-borderless align-middle mb-0 detalle-pedido">
      <caption className="visually-hidden">Productos del pedido #{pedido.id}</caption>
      <thead>
        <tr className="small text-secondary">
          <th scope="col" className="fw-normal">
            Producto
          </th>
          <th scope="col" className="fw-normal text-end">
            Cantidad
          </th>
          <th scope="col" className="fw-normal text-end">
            Precio
          </th>
          <th scope="col" className="fw-normal text-end">
            Subtotal
          </th>
        </tr>
      </thead>
      <tbody>
        {pedido.items.map((item) => (
          <tr key={item.productId}>
            <td>
              <Link to={`/producto/${item.productId}`}>{item.name}</Link>
            </td>
            <td className="text-end">{item.quantity}</td>
            <td className="text-end text-nowrap">{formatearPrecio(item.price)}</td>
            <td className="text-end text-nowrap">{formatearPrecio(item.price * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-top">
          <th scope="row" colSpan={3} className="text-end">
            Total
          </th>
          <td className="text-end text-nowrap fw-semibold">{formatearPrecio(pedido.total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
