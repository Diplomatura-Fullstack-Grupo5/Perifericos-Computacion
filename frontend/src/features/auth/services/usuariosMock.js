import { Buffer } from "node:buffer";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import fs from "node:fs";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const MAX_BYTES_SOLICITUD = 16 * 1024;
const RUTA_REGISTRO = "/api/usuarios/registro";

class ErrorSolicitud extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Crea el middleware local que simula el alta de usuarios y persiste datos en el JSON.
 * @param {string} archivoUsuarios Ruta absoluta al JSON de usuarios.
 * @returns {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next: Function) => void}
 */
export function crearMiddlewareRegistro(archivoUsuarios) {
  return async function manejarRegistro(req, res, next) {
    const ruta = req.url.split("?")[0];
    if (ruta !== RUTA_REGISTRO) return next();

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.statusCode = 405;
      return res.end(JSON.stringify({ message: "Método no permitido." }));
    }

    try {
      const datos = await leerCuerpo(req);
      if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        throw new ErrorSolicitud(400, "Los datos del registro no son válidos.");
      }

      const name = typeof datos.name === "string" ? datos.name.trim() : "";
      const email =
        typeof datos.email === "string" ? datos.email.trim().toLowerCase() : "";
      const password = typeof datos.password === "string" ? datos.password : "";

      if (!name || name.length > 100) {
        throw new ErrorSolicitud(
          400,
          "Ingresá un nombre de hasta 100 caracteres.",
        );
      }

      if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new ErrorSolicitud(400, "Ingresá un correo electrónico válido.");
      }

      if (password.length < 8 || password.length > 128) {
        throw new ErrorSolicitud(
          400,
          "La contraseña debe tener entre 8 y 128 caracteres.",
        );
      }

      const salt = randomBytes(16);
      const hash = await scrypt(password, salt, 64);
      const passwordHash = `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
      const usuarios = JSON.parse(fs.readFileSync(archivoUsuarios, "utf8"));

      if (!Array.isArray(usuarios)) {
        throw new Error("El archivo de usuarios no contiene una lista.");
      }

      const emailExistente = usuarios.some(
        (usuario) => usuario.email?.trim().toLowerCase() === email,
      );
      if (emailExistente) {
        throw new ErrorSolicitud(
          409,
          "Ya existe una cuenta con ese correo electrónico.",
        );
      }

      const usuario = {
        id: usuarios.reduce(
          (mayorId, registro) =>
            Number.isInteger(registro.id)
              ? Math.max(mayorId, registro.id)
              : mayorId,
          0,
        ) + 1,
        name,
        email,
        passwordHash,
        role: "cliente",
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(
        archivoUsuarios,
        `${JSON.stringify([...usuarios, usuario], null, 2)}\n`,
        "utf8",
      );

      res.statusCode = 201;
      return res.end(
        JSON.stringify({
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          role: usuario.role,
          createdAt: usuario.createdAt,
        }),
      );
    } catch (error) {
      if (error instanceof ErrorSolicitud) {
        res.statusCode = error.status;
        return res.end(JSON.stringify({ message: error.message }));
      }

      console.error("Error en el registro simulado de usuarios:", error);
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ message: "No se pudo completar el registro." }),
      );
    }
  };
}

async function leerCuerpo(req) {
  const partes = [];
  let bytes = 0;

  for await (const parte of req) {
    bytes += parte.length;
    if (bytes > MAX_BYTES_SOLICITUD) {
      throw new ErrorSolicitud(413, "La solicitud es demasiado grande.");
    }
    partes.push(parte);
  }

  try {
    return JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    throw new ErrorSolicitud(400, "El cuerpo de la solicitud no es JSON válido.");
  }
}
