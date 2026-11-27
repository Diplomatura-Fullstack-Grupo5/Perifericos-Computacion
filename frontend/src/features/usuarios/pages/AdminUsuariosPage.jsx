import { useEffect, useState } from "react";
import {
  cambiarRolUsuario,
  obtenerUsuarios,
  ROLES_USUARIO,
  USUARIOS_POR_PAGINA,
} from "../services/usuariosService";
import { formatearRol } from "../utils/formatearRol";
import { TablaUsuarios } from "../components/TablaUsuarios";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { Aviso } from "../../../shared/components/molecules/Aviso";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { Paginacion } from "../../../shared/components/molecules/Paginacion";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";
import { useFiltrosUrl } from "../../../shared/hooks/useFiltrosUrl";

/** Textos del modal que confirma cada cambio de rol, según el rol nuevo. */
const CONFIRMACIONES = {
  administrador: {
    titulo: "Hacer administrador",
    textoConfirmar: "Hacer administrador",
    claseConfirmar: "btn-primary",
    explicacion: "Va a poder entrar al panel y modificar productos, pedidos y usuarios.",
  },
  cliente: {
    titulo: "Quitar administrador",
    textoConfirmar: "Quitar administrador",
    claseConfirmar: "btn-danger",
    explicacion: "Va a quedar como cliente y no va a poder entrar más al panel.",
  },
};

/**
 * Gestión de usuarios y roles del panel de administración: búsqueda por nombre o correo, filtro por
 * rol (en la URL: `?busqueda=&rol=&pagina=`) y cambio de rol cliente ↔ administrador con confirmación. Al
 * último administrador no se le puede quitar el rol.
 * @returns {JSX.Element}
 */
export function AdminUsuariosPage() {
  const { searchParams, consulta, cambiarFiltro, cambiarPagina } = useFiltrosUrl();
  const busqueda = searchParams.get("busqueda") ?? "";
  const rol = searchParams.get("rol") ?? "";
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);

  const [resultado, setResultado] = useState({
    consulta: null,
    usuarios: [],
    total: 0,
    porRol: {},
    administradores: 0,
    error: null,
  });
  const [cambio, setCambio] = useState(null);
  const [idGuardando, setIdGuardando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cargando = resultado.consulta !== consulta;
  const { usuarios, total, porRol, administradores, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;
    const timer = setTimeout(() => {
      obtenerUsuarios({ busqueda, rol, pagina })
        .then((datos) => {
          if (!ignoreResponse) setResultado({ consulta, ...datos, error: null });
        })
        .catch((err) => {
          if (ignoreResponse) return;
          console.error("Error al obtener los usuarios:", err);
          setResultado({
            consulta,
            usuarios: [],
            total: 0,
            porRol: {},
            administradores: 0,
            error: "No se pudieron cargar los usuarios. Por favor, intentá de nuevo.",
          });
        });
    }, 300);

    return () => {
      ignoreResponse = true;
      clearTimeout(timer);
    };
  }, [consulta, busqueda, rol, pagina]);

  function irAPagina(numero) {
    cambiarPagina(numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Guarda el cambio de rol confirmado en el modal y actualiza la fila y los contadores sin volver a
   * pedir la lista (el usuario queda visible aunque ya no coincida con el filtro de rol).
   */
  async function handleConfirmarCambio() {
    const { usuario, rol: rolNuevo } = cambio;
    setCambio(null);
    setIdGuardando(usuario.id);
    try {
      const actualizado = await cambiarRolUsuario(usuario, rolNuevo);
      setResultado((prev) => ({
        ...prev,
        usuarios: prev.usuarios.map((u) => (u.id === actualizado.id ? actualizado : u)),
        porRol: {
          ...prev.porRol,
          [usuario.role]: prev.porRol[usuario.role] - 1,
          [rolNuevo]: prev.porRol[rolNuevo] + 1,
        },
        administradores: prev.administradores + (rolNuevo === "administrador" ? 1 : -1),
      }));
      setAviso({
        tipo: "success",
        texto: `${usuario.name} ahora es ${formatearRol(rolNuevo).texto.toLowerCase()}.`,
      });
    } catch (err) {
      console.error("Error al cambiar el rol del usuario:", err);
      // Solo los errores de las reglas de negocio (sin `status` HTTP) traen un mensaje para el usuario.
      const detalle = err.status === undefined ? err.message : "Por favor, intentá de nuevo.";
      setAviso({ tipo: "danger", texto: `No se pudo cambiar el rol de ${usuario.name}. ${detalle}` });
    } finally {
      setIdGuardando(null);
    }
  }

  const confirmacion = cambio ? CONFIRMACIONES[cambio.rol] : null;

  return (
    <>
      <h1 className="fs-3 mb-3">Usuarios</h1>

      {aviso && (
        <Aviso tipo={aviso.tipo} onCerrar={() => setAviso(null)}>
          {aviso.texto}
        </Aviso>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <label htmlFor="usuarios-busqueda" className="visually-hidden">
            Buscar por nombre o correo
          </label>
          <input
            id="usuarios-busqueda"
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="usuarios-rol" className="visually-hidden">
            Rol
          </label>
          <select
            id="usuarios-rol"
            className="form-select"
            value={rol}
            onChange={(e) => cambiarFiltro("rol", e.target.value)}
          >
            <option value="">Todos los roles</option>
            {ROLES_USUARIO.map((nombre) => (
              <option key={nombre} value={nombre}>
                {formatearRol(nombre).plural}
                {nombre in porRol ? ` (${porRol[nombre]})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {total} {total === 1 ? "usuario" : "usuarios"}
          </p>
          {usuarios.length === 0 ? (
            <MensajeVacio>No hay usuarios que coincidan con la búsqueda.</MensajeVacio>
          ) : (
            <>
              <TablaUsuarios
                usuarios={usuarios}
                administradores={administradores}
                idGuardando={idGuardando}
                onCambiarRol={(usuario, rolNuevo) => setCambio({ usuario, rol: rolNuevo })}
              />
              <Paginacion
                paginaActual={pagina}
                totalPaginas={Math.ceil(total / USUARIOS_POR_PAGINA)}
                onChange={irAPagina}
                etiqueta="Páginas de usuarios"
              />
            </>
          )}
        </>
      )}

      <ModalConfirmacion
        abierto={cambio !== null}
        titulo={confirmacion?.titulo ?? ""}
        textoConfirmar={confirmacion?.textoConfirmar}
        claseConfirmar={confirmacion?.claseConfirmar}
        textoCancelar="Volver"
        onConfirmar={handleConfirmarCambio}
        onCancelar={() => setCambio(null)}
      >
        ¿Pasar a <strong>{cambio?.usuario.name}</strong> ({cambio?.usuario.email}) a{" "}
        <strong>{cambio && formatearRol(cambio.rol).texto.toLowerCase()}</strong>?{" "}
        {confirmacion?.explicacion}
      </ModalConfirmacion>
    </>
  );
}
