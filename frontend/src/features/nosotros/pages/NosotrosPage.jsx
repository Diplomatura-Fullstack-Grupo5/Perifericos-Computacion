import { Link } from "react-router";
import { EncabezadoPagina } from "../../../shared/components/molecules/EncabezadoPagina";
import "./NosotrosPage.css";

const DATOS = [
  { valor: "2026", texto: "Año en que abrimos" },
  { valor: "+3.200", texto: "Pedidos entregados" },
  { valor: "+450", texto: "Productos con especificaciones cargadas" },
  { valor: "24 h", texto: "Tiempo de respuesta a consultas" },
];

const VALORES = [
  {
    titulo: "Datos claros",
    texto:
      "Cada producto muestra sus especificaciones técnicas en el mismo orden y con las mismas unidades.",
  },
  {
    titulo: "Comparación honesta",
    texto:
      "Marcamos el mejor valor de cada especificación según su regla, sin favorecer a ninguna marca.",
  },
  {
    titulo: "Atención cercana",
    texto:
      "Respondemos cada consulta en menos de 24 horas, con personas que usan lo que venden.",
  },
  {
    titulo: "Garantía real",
    texto:
      "Todos los productos tienen garantía oficial y cambio dentro de los 10 días de recibidos.",
  },
];

const EQUIPO = [
  "Florencia Bordagorry",
  "German Altamirano",
  "Pedro Risma",
  "Santiago Masramón",
];

/**
 * Página "Nosotros": historia de la tienda, datos, valores, equipo y una invitación a contactarnos.
 * @returns {JSX.Element}
 */
export function NosotrosPage() {
  return (
    <div className="nosotros">
      {/* -------------------- Encabezado e historia -------------------- */}
      <EncabezadoPagina titulo="Nosotros">
        <p>
          PuntoTech nació en 2026, en un departamento de San Luis, cuando cuatro amigos se
          cansaron de abrir diez pestañas para comparar dos mouses. Las tiendas mostraban las
          características como texto suelto, y cada marca las nombraba distinto.
        </p>
        <p>
          Empezamos cargando a mano las especificaciones de unos pocos productos en una
          planilla. Hoy cada artículo del catálogo tiene sus datos técnicos ordenados, y nuestro
          comparador resalta las diferencias y marca el mejor valor de cada una.
        </p>
      </EncabezadoPagina>

      <div className="container py-4">

        {/* -------------------- Datos -------------------- */}
        <section className="mb-5" aria-label="PuntoTech en números">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
            {DATOS.map((dato) => (
              <div key={dato.texto} className="col">
                <div className="nosotros-tarjeta h-100 p-4">
                  <p className="nosotros-dato-valor mb-1">{dato.valor}</p>
                  <p className="small text-body-secondary mb-0">{dato.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- Lo que nos importa -------------------- */}
        <section className="mb-5">
          <h2 className="fs-3 fw-bold mb-3">Lo que nos importa</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
            {VALORES.map((valor) => (
              <div key={valor.titulo} className="col">
                <div className="nosotros-tarjeta h-100 p-4">
                  <span className="nosotros-rayita" aria-hidden="true" />
                  <h3 className="fs-6 fw-bold mb-2">{valor.titulo}</h3>
                  <p className="small text-body-secondary mb-0">{valor.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- El equipo -------------------- */}
        <section className="mb-5">
          <h2 className="fs-3 fw-bold mb-3">El equipo</h2>
          <ul className="list-unstyled row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-3">
            {EQUIPO.map((nombre) => (
              <li key={nombre} className="col">
                <div className="nosotros-tarjeta h-100 p-4">
                  <p className="fw-bold mb-1">{nombre}</p>
                  <p className="small fw-semibold text-primary mb-0">Desarrollo full stack</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="small text-body-secondary mb-0">
            Somos el Grupo 5 de la Diplomatura Full Stack: todos participamos en el diseño, el
            frontend y el backend del sitio.
          </p>
        </section>

        {/* -------------------- Contacto -------------------- */}
        <section className="nosotros-contacto d-flex flex-wrap align-items-center justify-content-between gap-3 p-4 p-md-5">
          <div>
            <h2 className="fs-3 fw-bold text-white mb-2">¿Tenés dudas? Contactanos</h2>
            <p className="mb-0">
              Escribinos por consultas sobre productos, pedidos, envíos o lo que necesites, y
              te respondemos a la brevedad.
            </p>
          </div>
          <Link to="/contacto" className="btn btn-light fw-semibold px-4">
            Ir a Contacto
          </Link>
        </section>
      </div>
    </div>
  );
}
