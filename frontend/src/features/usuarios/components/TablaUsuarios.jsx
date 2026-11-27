import { obtenerMotivoSinCambioDeRol, obtenerRolSiguiente } from "../services/usuariosService";
import { formatearRol } from "../utils/formatearRol";

const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" });

/** Botón de cada rol al que se puede pasar un usuario. */
const ACCIONES_ROL = {
  administrador: {
    texto: "Hacer administrador",
    icono: "bi-shield-plus",
    clases: "btn-outline-primary",
  },
  cliente: {
    texto: "Quitar administrador",
    icono: "bi-shield-minus",
    clases: "btn-outline-danger",
  },
};

/**
 * Tabla de usuarios del panel, con el botón para cambiar el rol de cada uno. Si a un administrador
 * no se le puede quitar el rol (ver `obtenerMotivoSinCambioDeRol`), en lugar del botón se muestra
 * el motivo.
 * @param {object} props
 * @param {object[]} props.usuarios
 * @param {number} props.administradores Cuántos administradores hay en total.
 * @param {number | null} props.idGuardando Usuario cuyo cambio de rol se está guardando (su botón
 *   queda deshabilitado).
 * @param {(usuario: object, rol: string) => void} props.onCambiarRol Se llama al pedir pasar un
 *   usuario a otro rol.
 * @returns {JSX.Element}
 */
export function TablaUsuarios({ usuarios, administradores, idGuardando, onCambiarRol }) {
  return (
    <div className="card overflow-hidden">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light tabla-panel__encabezado">
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Registro</th>
              <th scope="col">Rol</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const rol = formatearRol(usuario.role);
              const rolSiguiente = obtenerRolSiguiente(usuario);
              const accion = ACCIONES_ROL[rolSiguiente];
              const motivo = obtenerMotivoSinCambioDeRol(usuario, administradores);

              return (
                <tr key={usuario.id}>
                  <td>
                    <div className="fw-semibold">{usuario.name}</div>
                    <div className="small text-secondary text-break">{usuario.email}</div>
                  </td>
                  <td className="text-nowrap">
                    <time dateTime={usuario.createdAt}>
                      {formatoFecha.format(new Date(usuario.createdAt))}
                    </time>
                  </td>
                  <td>
                    <span className={`badge ${rol.clases}`}>{rol.texto}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    {motivo ? (
                      <span className="small text-secondary">{motivo}</span>
                    ) : (
                      <button
                        type="button"
                        className={`btn btn-sm ${accion.clases}`}
                        disabled={idGuardando === usuario.id}
                        aria-label={`${accion.texto}: ${usuario.name}`}
                        onClick={() => onCambiarRol(usuario, rolSiguiente)}
                      >
                        <i className={`bi ${accion.icono} me-1`} aria-hidden="true" />
                        {accion.texto}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
