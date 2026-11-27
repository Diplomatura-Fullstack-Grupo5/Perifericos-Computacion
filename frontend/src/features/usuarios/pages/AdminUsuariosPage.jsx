import { useEffect, useId, useState } from "react";
import { useSearchParams } from "react-router";
import { cambiarRolUsuario, obtenerUsuarios, ROLES_USUARIO } from "../services/usuariosService";
import { formatearRol } from "../utils/formatearRol";
import { TablaUsuarios } from "../components/TablaUsuarios";
import { Spinner } from "../../../shared/components/atoms/Spinner";
import { MensajeVacio } from "../../../shared/components/molecules/MensajeVacio";
import { ModalConfirmacion } from "../../../shared/components/molecules/ModalConfirmacion";

/** Cantidad de usuarios que se muestran al principio y que se suman con "Mostrar más". */
const USUARIOS_POR_TANDA = 20;

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
 * rol (en la URL: `?busqueda=&rol=`) y cambio de rol cliente ↔ administrador con confirmación. Al
 * último administrador no se le puede quitar el rol.
 * @returns {JSX.Element}
 */
export function AdminUsuariosPage() {
  const idBase = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get("busqueda") ?? "";
  const rol = searchParams.get("rol") ?? "";
  const clave = searchParams.toString();

  const [resultado, setResultado] = useState({
    clave: null,
    usuarios: [],
    total: 0,
    porRol: {},
    administradores: 0,
    error: null,
  });
  const [cantidadVisible, setCantidadVisible] = useState(USUARIOS_POR_TANDA);
  const [cambio, setCambio] = useState(null);
  const [idGuardando, setIdGuardando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cargando = resultado.clave !== clave;
  const { usuarios, total, porRol, administradores, error } = resultado;

  useEffect(() => {
    let ignoreResponse = false;

    obtenerUsuarios({ busqueda, rol })
      .then((datos) => {
        if (!ignoreResponse) setResultado({ clave, ...datos, error: null });
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al obtener los usuarios:", err);
        setResultado({
          clave,
          usuarios: [],
          total: 0,
          porRol: {},
          administradores: 0,
          error: "No se pudieron cargar los usuarios. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, [clave, busqueda, rol]);

  /**
   * Cambia un filtro en la URL y vuelve a mostrar la primera tanda de usuarios. Sin valor, quita el
   * filtro. Reemplaza la entrada del historial para no llenarlo con cada letra de la búsqueda.
   * @param {string} nombre
   * @param {string} valor
   */
  function cambiarFiltro(nombre, valor) {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(nombre, valor);
    else params.delete(nombre);
    setSearchParams(params, { replace: true });
    setCantidadVisible(USUARIOS_POR_TANDA);
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
      setResultado({
        ...resultado,
        usuarios: usuarios.map((u) => (u.id === actualizado.id ? actualizado : u)),
        porRol: {
          ...porRol,
          [usuario.role]: porRol[usuario.role] - 1,
          [rolNuevo]: porRol[rolNuevo] + 1,
        },
        administradores: administradores + (rolNuevo === "administrador" ? 1 : -1),
      });
      setAviso({
        tipo: "success",
        texto: `${usuario.name} ahora es ${formatearRol(rolNuevo).texto.toLowerCase()}.`,
      });
    } catch (err) {
      console.error("Error al cambiar el rol del usuario:", err);
      // Los errores de las reglas de negocio traen un mensaje para el usuario; los del servidor
      // (con `status`) no, así que para esos se muestra un texto genérico.
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
        <div className={`alert alert-${aviso.tipo} d-flex align-items-start`} role="status">
          <span className="flex-grow-1">{aviso.texto}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar aviso"
            onClick={() => setAviso(null)}
          />
        </div>
      )}

      {/* -------------------- Búsqueda y filtros -------------------- */}
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <label htmlFor={`${idBase}-busqueda`} className="visually-hidden">
            Buscar por nombre o correo
          </label>
          <input
            id={`${idBase}-busqueda`}
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(e) => cambiarFiltro("busqueda", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`${idBase}-rol`} className="visually-hidden">
            Rol
          </label>
          <select
            id={`${idBase}-rol`}
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

      {/* -------------------- Resultados -------------------- */}
      {cargando && <Spinner />}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="text-secondary small">
            {usuarios.length} de {total} usuarios
          </p>
          {usuarios.length === 0 ? (
            <MensajeVacio>No hay usuarios que coincidan con la búsqueda.</MensajeVacio>
          ) : (
            <>
              <TablaUsuarios
                usuarios={usuarios.slice(0, cantidadVisible)}
                administradores={administradores}
                idGuardando={idGuardando}
                onCambiarRol={(usuario, rolNuevo) => setCambio({ usuario, rol: rolNuevo })}
              />
              {cantidadVisible < usuarios.length && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setCantidadVisible(cantidadVisible + USUARIOS_POR_TANDA)}
                  >
                    Mostrar más ({usuarios.length - cantidadVisible} restantes)
                  </button>
                </div>
              )}
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
