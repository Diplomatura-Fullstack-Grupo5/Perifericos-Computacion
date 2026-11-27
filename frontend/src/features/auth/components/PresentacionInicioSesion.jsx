import { Link } from "react-router";
import { FormularioInicioSesion } from "./FormularioInicioSesion";
import "./PresentacionInicioSesion.css";

/**
 * Presenta el hero, el formulario de acceso y los beneficios de la página de login.
 * @param {{ onSubmit: (credenciales: { email: string, password: string }) => void, mensaje: { tipo: string, texto: string }|null, enviando: boolean }} props
 * @returns {JSX.Element}
 */
export function PresentacionInicioSesion({ onSubmit, mensaje, enviando }) {
  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero-fondo" aria-hidden="true">
          <div className="login-onda login-onda-1" />
          <div className="login-onda login-onda-2" />
          <img
            className="login-periferico login-teclado"
            src="/images/products/teclado-3.webp"
            alt=""
          />
          <img
            className="login-periferico login-auriculares"
            src="/images/products/auricular-4.webp"
            alt=""
          />
          <img
            className="login-periferico login-mouse"
            src="/images/products/mouse-4.webp"
            alt=""
          />
        </div>

        <header className="login-presentacion">
          <h1>
            Todo tu setup
            <br />
            <span>empieza acá.</span>
          </h1>
          <p>
            Iniciá sesión para acceder a tu cuenta, gestionar tus pedidos y
            disfrutar de una experiencia personalizada.
          </p>
        </header>

        <section className="login-card" aria-labelledby="login-titulo">
          <div className="login-card-header">
            <h2 id="login-titulo">Iniciar sesión</h2>
            <p>Ingresá tus datos para acceder a tu cuenta.</p>
          </div>

          <FormularioInicioSesion
            onSubmit={onSubmit}
            mensaje={mensaje}
            enviando={enviando}
          />

          <div className="login-separador" aria-hidden="true">
            <span />
            <div>•</div>
            <span />
          </div>

          <div className="login-crear-cuenta">
            <span>¿No tenés una cuenta?</span>
            <Link to="/registrarse" className="login-registro-boton">
              Crear cuenta
            </Link>
          </div>
        </section>
      </section>

      <section className="login-beneficios" aria-label="Beneficios">
        <article className="login-beneficio">
          <i className="bi bi-truck" aria-hidden="true" />
          <div>
            <h3>Envíos a todo el país</h3>
            <p>Recibí tus productos en casa.</p>
          </div>
        </article>
        <article className="login-beneficio">
          <i className="bi bi-shield-check" aria-hidden="true" />
          <div>
            <h3>Compras seguras</h3>
            <p>Tus datos siempre protegidos.</p>
          </div>
        </article>
        <article className="login-beneficio">
          <i className="bi bi-headset" aria-hidden="true" />
          <div>
            <h3>Soporte personalizado</h3>
            <p>Te acompañamos en tu compra.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
