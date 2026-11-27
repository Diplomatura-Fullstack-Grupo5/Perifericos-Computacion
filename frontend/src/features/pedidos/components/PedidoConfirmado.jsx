import { Link } from "react-router";
import { ResumenPedido } from "./ResumenPedido";

/**
 * Pantalla que se muestra después de guardar el pedido: número, datos de envío y pago, y resumen.
 * @param {object} props
 * @param {object} props.pedido Pedido guardado, tal como lo devuelve la API.
 * @returns {JSX.Element}
 */
export function PedidoConfirmado({ pedido }) {
  const items = pedido.items.map(({ productId, name, price, quantity }) => ({
    id: productId,
    name,
    price,
    quantity,
  }));

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <i className="bi bi-check-circle-fill text-success display-4" aria-hidden="true" />
        <h1 className="fs-3 fw-bold mt-3 mb-1">¡Pedido confirmado!</h1>
        <p className="fs-5 mb-1">
          Pedido <strong>N.° {pedido.id}</strong>
        </p>
        <p className="text-secondary">Guardá este número para consultar el estado de tu pedido.</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-6 col-lg-5">
          <section className="card h-100">
            <div className="card-header bg-body">
              <h2 className="fs-6 fw-bold mb-0">Datos del pedido</h2>
            </div>
            <dl className="card-body mb-0">
              <dt className="small text-secondary">A nombre de</dt>
              <dd>{pedido.customer}</dd>
              <dt className="small text-secondary">Contacto</dt>
              <dd>
                {pedido.email} · {pedido.phone}
              </dd>
              <dt className="small text-secondary">Envío a</dt>
              <dd>
                {pedido.shipping.address}, {pedido.shipping.city} ({pedido.shipping.postalCode})
              </dd>
              <dt className="small text-secondary">Medio de pago</dt>
              <dd className="mb-0">{pedido.paymentMethod}</dd>
            </dl>
          </section>
        </div>

        <div className="col-md-6 col-lg-5">
          <ResumenPedido items={items} total={pedido.total} />
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/catalogo" className="btn btn-primary">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
