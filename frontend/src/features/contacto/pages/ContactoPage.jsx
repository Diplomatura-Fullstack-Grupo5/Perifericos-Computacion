import { FormularioContacto } from "../components/FormularioContacto";
import { EncabezadoPagina } from "../../../shared/components/molecules/EncabezadoPagina";
import "./ContactoPage.css";

const DIRECCION_MAPA = "Rivadavia 626, 5700 San Luis, Argentina";

const DATOS_CONTACTO = [
  {
    icono: "bi-envelope",
    etiqueta: "Email",
    valor: "contacto@puntotech.com.ar",
    enlace: "mailto:contacto@puntotech.com.ar",
  },
  {
    icono: "bi-telephone",
    etiqueta: "Teléfono / WhatsApp",
    valor: "(0266) 123-4567",
    enlace: "tel:+542661234567",
  },
  { icono: "bi-geo-alt", etiqueta: "Dirección", valor: "Rivadavia 626, San Luis" },
  { icono: "bi-clock", etiqueta: "Horarios", valor: "Lun a Vie 9 a 18 h · Sáb 9 a 13 h" },
];

const PREGUNTAS = [
  {
    pregunta: "¿Cuánto tarda el envío?",
    respuesta:
      "Entre 2 y 5 días hábiles según tu provincia. Te avisamos por email cuando el pedido sale de nuestro depósito.",
  },
  {
    pregunta: "¿Puedo cambiar un producto?",
    respuesta:
      "Sí, dentro de los 10 días de recibido y con el embalaje original. Escribinos con el número de pedido.",
  },
  {
    pregunta: "¿Los productos tienen garantía?",
    respuesta: "Todos incluyen garantía oficial del fabricante.",
  },
];

/**
 * Página "Contacto": formulario de consulta, otras formas de contacto, mapa y preguntas frecuentes.
 * @returns {JSX.Element}
 */
export function ContactoPage() {
  return (
    <div className="contacto">
      <EncabezadoPagina titulo="Contacto">
        <p>
          Escribinos por cualquier duda sobre productos, pedidos o garantías. Respondemos en
          menos de 24 horas.
        </p>
      </EncabezadoPagina>

      <div className="container py-4">
        <div className="row g-4 mb-5">
          {/* -------------------- Formulario -------------------- */}
          <div className="col-lg-7">
            <section className="contacto-tarjeta h-100 p-4">
              <h2 className="fs-4 fw-bold mb-3">Enviános tu consulta</h2>
              <FormularioContacto />
            </section>
          </div>

          {/* -------------------- Otras formas de contacto y mapa -------------------- */}
          <div className="col-lg-5 d-flex flex-column gap-4">
            <section className="contacto-tarjeta p-4">
              <h2 className="fs-5 fw-bold mb-3">Otras formas de contacto</h2>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                {DATOS_CONTACTO.map((dato) => (
                  <li key={dato.etiqueta} className="d-flex align-items-center gap-3">
                    <span className="contacto-icono" aria-hidden="true">
                      <i className={`bi ${dato.icono}`} />
                    </span>
                    <div>
                      <span className="d-block small text-body-secondary">{dato.etiqueta}</span>
                      {dato.enlace ? (
                        <a href={dato.enlace} className="fw-semibold text-body text-decoration-none">
                          {dato.valor}
                        </a>
                      ) : (
                        <span className="fw-semibold">{dato.valor}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <iframe
              className="contacto-mapa flex-grow-1"
              title={`Mapa: ${DIRECCION_MAPA}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(DIRECCION_MAPA)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* -------------------- Preguntas frecuentes -------------------- */}
        <section>
          <h2 className="fs-3 fw-bold mb-3">Preguntas frecuentes</h2>
          <div className="contacto-tarjeta px-4 py-2">
            {PREGUNTAS.map(({ pregunta, respuesta }) => (
              <details key={pregunta} className="contacto-pregunta">
                <summary className="fw-semibold">{pregunta}</summary>
                <p className="text-body-secondary mb-0 mt-2">{respuesta}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
