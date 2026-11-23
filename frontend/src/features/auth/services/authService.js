import { enviar } from "../../../api/cliente";
import { ENDPOINTS } from "../../../api/endpoints";

/**
 * Registra un usuario mediante una API simulada.
 * @param {{ name: string, email: string, password: string }} usuario
 * @returns {Promise<{ id: number, name: string, email: string, role: string, createdAt: string }>}
 */
export function registrarUsuario(usuario) {
  return enviar(ENDPOINTS.registrarUsuario, usuario);
}