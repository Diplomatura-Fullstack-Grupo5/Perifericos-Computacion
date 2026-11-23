import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import "./Legales.css";

const ULTIMA_ACTUALIZACION = "noviembre de 2026";
const EMAIL_CONTACTO = "contacto@puntotech.com.ar";

const SECCIONES = [
  { id: "terminos", titulo: "Términos y condiciones" },
  { id: "privacidad", titulo: "Política de privacidad" },
  { id: "devoluciones", titulo: "Cambios, devoluciones y garantía" },
  { id: "arrepentimiento", titulo: "Botón de arrepentimiento" },
];

/**
 * Página de información legal: términos, privacidad, devoluciones y arrepentimiento.
 * Si la URL trae un ancla (#terminos, etc.), hace scroll a esa sección.
 * @returns {JSX.Element}
 */
export function Legales() {
  const { hash } = useLocation();

  // React Router no hace scroll a los anclas (#terminos, etc.) por sí solo.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="legales">
      <header className="legales__header">
        <h1>Legales</h1>
        <p className="legales__fecha">Última actualización: {ULTIMA_ACTUALIZACION}</p>
        <div className="legales__aviso" role="note">
          <strong>Aviso:</strong> PuntoTech es un sitio desarrollado con fines académicos
          (Proyecto Integrador · Grupo 5). No se realizan ventas, cobros ni envíos reales, y
          los datos que ingreses se usan solo para probar el funcionamiento del sitio.
        </div>
      </header>

      <nav className="legales__indice" aria-label="Secciones">
        {SECCIONES.map((s) => (
          <Link
            key={s.id}
            to={`#${s.id}`}
            className={hash === `#${s.id}` ? "activo" : undefined}
          >
            {s.titulo}
          </Link>
        ))}
      </nav>

      {/* ---------------------------------------------------------------- */}
      <section id="terminos" className="legales__seccion">
        <h2>Términos y condiciones</h2>

        <h3>1. Aceptación</h3>
        <p>
          Al navegar o comprar en PuntoTech aceptás estos términos. Si no estás de acuerdo con
          alguno de ellos, te pedimos que no uses el sitio.
        </p>

        <h3>2. Cuenta de usuario</h3>
        <p>
          Para comprar necesitás registrarte con datos verdaderos. Sos responsable de mantener
          tu contraseña en secreto y de toda actividad realizada desde tu cuenta. Si detectás un
          uso no autorizado, avisanos a {EMAIL_CONTACTO}.
        </p>

        <h3>3. Productos, precios y stock</h3>
        <p>
          Las especificaciones técnicas, imágenes y precios se publican con el mayor cuidado
          posible, pero pueden contener errores. Los precios están expresados en pesos
          argentinos e incluyen IVA. Todas las compras están sujetas a disponibilidad de stock
          al momento de confirmar el pedido; si un producto se agota, te ofreceremos un
          reemplazo o el reintegro total de lo abonado.
        </p>

        <h3>4. Comparador de productos</h3>
        <p>
          El comparador resalta diferencias a partir de las especificaciones informadas por cada
          fabricante. Es una herramienta orientativa y no reemplaza la ficha técnica oficial del
          producto.
        </p>

        <h3>5. Pedidos y pagos</h3>
        <p>
          El pedido se considera confirmado cuando recibís el correo de confirmación con su
          número. PuntoTech puede cancelar pedidos ante errores evidentes de precio, sospecha de
          fraude o falta de stock, reintegrando el total abonado.
        </p>

        <h3>6. Envíos</h3>
        <p>
          Los plazos de entrega son estimados y se cuentan en días hábiles desde la confirmación
          del pago. El costo de envío se informa antes de finalizar la compra.
        </p>

        <h3>7. Propiedad intelectual</h3>
        <p>
          El diseño, logo y contenidos propios del sitio pertenecen a PuntoTech. Las marcas e
          imágenes de los productos pertenecen a sus respectivos fabricantes.
        </p>

        <h3>8. Modificaciones y ley aplicable</h3>
        <p>
          Podemos actualizar estos términos; la versión vigente es siempre la publicada en esta
          página. Se rigen por las leyes de la República Argentina, en particular la Ley 24.240
          de Defensa del Consumidor.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section id="privacidad" className="legales__seccion">
        <h2>Política de privacidad</h2>

        <h3>Qué datos recopilamos</h3>
        <ul>
          <li>Datos de registro: nombre, email y contraseña almacenada de manera cifrada.</li>
          <li>Datos de compra: dirección de envío, teléfono e historial de pedidos.</li>
          <li>Datos de uso: productos visitados y comparados, para mejorar el catálogo.</li>
        </ul>

        <h3>Para qué los usamos</h3>
        <p>
          Para procesar tus pedidos, gestionar tu cuenta, responder consultas y, si lo aceptás,
          enviarte novedades. No vendemos ni cedemos tus datos a terceros, salvo a quienes
          intervienen en el envío o el cobro y solo en la medida necesaria.
        </p>

        <h3>Tus derechos</h3>
        <p>
          Podés acceder, rectificar o pedir la eliminación de tus datos en cualquier momento
          escribiendo a {EMAIL_CONTACTO}, conforme a la Ley 25.326 de Protección de los Datos
          Personales.
        </p>

        <h3>Sesión y almacenamiento local</h3>
        <p>
          Usamos un token de sesión para mantenerte conectado y el almacenamiento del navegador
          para recordar tu carrito. Podés borrarlos cerrando sesión o limpiando los datos del
          navegador.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section id="devoluciones" className="legales__seccion">
        <h2>Cambios, devoluciones y garantía</h2>

        <h3>Cambios</h3>
        <p>
          Podés cambiar un producto dentro de los 30 días de recibido, siempre que esté sin uso,
          en su embalaje original y con todos sus accesorios.
        </p>

        <h3>Garantía</h3>
        <p>
          Todos los productos cuentan con la garantía legal establecida por la Ley 24.240 y, en
          su caso, la garantía adicional del fabricante indicada en la ficha del producto. Si un
          producto presenta una falla, escribinos a {EMAIL_CONTACTO} con tu número de pedido y
          una descripción del problema.
        </p>

        <h3>Qué no cubre la garantía</h3>
        <ul>
          <li>Daños por golpes, líquidos o mal uso.</li>
          <li>Productos abiertos o reparados por terceros.</li>
          <li>Desgaste normal (por ejemplo, pads de mouse o almohadillas de auriculares).</li>
        </ul>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section id="arrepentimiento" className="legales__seccion">
        <h2>Botón de arrepentimiento</h2>
        <p>
          Si compraste online, tenés derecho a revocar la compra dentro de los 10 días corridos
          desde que recibiste el producto, sin necesidad de explicar el motivo y sin costo
          alguno. Este derecho está previsto en la Ley 24.240 y el Código Civil y Comercial.
        </p>
        <p>
          Para ejercerlo, ingresá a <Link to="/mis-pedidos">Mis pedidos</Link>, elegí la compra
          y seleccioná <em>“Arrepentimiento”</em>, o escribinos a {EMAIL_CONTACTO} indicando tu
          número de pedido. Te enviaremos un código de identificación del trámite y te
          reintegraremos el total abonado.
        </p>
      </section>
    </div>
  );
}