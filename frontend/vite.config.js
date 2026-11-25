import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

const carpetaDatabase = fileURLToPath(new URL('../database', import.meta.url))

/** Colecciones de /database que se pueden modificar con POST, PUT y DELETE. */
const COLECCIONES_EDITABLES = ['productos']

/**
 * Lee el cuerpo JSON de un pedido.
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<any>} El objeto enviado, o `null` si el cuerpo está vacío.
 */
function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = ''
    req.on('data', (parte) => {
      cuerpo += parte
    })
    req.on('end', () => {
      try {
        resolve(cuerpo ? JSON.parse(cuerpo) : null)
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

/**
 * Responde con un status y, si hay datos, con un JSON.
 * @param {import('node:http').ServerResponse} res
 * @param {number} status
 * @param {any} [datos]
 */
function responder(res, status, datos) {
  res.statusCode = status
  if (datos === undefined) return res.end()
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(datos))
}

/**
 * Convierte una colección en texto con el mismo formato que los JSON de /database
 * (un objeto por bloque y los objetos anidados, como `specs`, en una sola línea).
 * @param {object[]} items
 * @returns {string}
 */
function formatearColeccion(items) {
  const valorEnLinea = (valor) =>
    valor !== null && typeof valor === 'object' && !Array.isArray(valor)
      ? `{ ${Object.entries(valor).map(([clave, v]) => `${JSON.stringify(clave)}: ${JSON.stringify(v)}`).join(', ')} }`
      : JSON.stringify(valor)

  const objetos = items.map(
    (item) =>
      `  {\n${Object.entries(item)
        .map(([clave, valor]) => `    ${JSON.stringify(clave)}: ${valorEnLinea(valor)}`)
        .join(',\n')}\n  }`,
  )
  return `[\n${objetos.join(',\n')}\n]\n`
}

/**
 * Simula las escrituras de la API sobre una colección de /database, guardando en su archivo JSON:
 * `POST /database/<coleccion>` agrega (con el id siguiente), `PUT /database/<coleccion>/:id` reemplaza
 * los campos enviados y `DELETE /database/<coleccion>/:id` borra.
 * Las reglas de negocio no van acá: las aplica el service de la feature, como hará el backend.
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function escribirColeccion(req, res) {
  const [, coleccion, idTexto] = req.url.split('?')[0].split('/')
  if (!COLECCIONES_EDITABLES.includes(coleccion)) {
    return responder(res, 404, { message: 'Colección no encontrada' })
  }

  const archivo = path.join(carpetaDatabase, `${coleccion}.json`)
  const items = JSON.parse(fs.readFileSync(archivo, 'utf8'))
  const id = Number(idTexto)
  const indice = items.findIndex((item) => item.id === id)

  let cuerpo
  try {
    cuerpo = await leerCuerpo(req)
  } catch {
    return responder(res, 400, { message: 'El cuerpo no es un JSON válido' })
  }

  const guardar = () => fs.writeFileSync(archivo, formatearColeccion(items))
  const cuerpoEsObjeto = cuerpo !== null && typeof cuerpo === 'object' && !Array.isArray(cuerpo)

  if (req.method === 'POST' && idTexto === undefined) {
    if (!cuerpoEsObjeto) return responder(res, 400, { message: 'Faltan los datos' })
    const nuevo = { id: Math.max(0, ...items.map((item) => item.id)) + 1, ...cuerpo }
    items.push(nuevo)
    guardar()
    return responder(res, 201, nuevo)
  }

  if (indice === -1) return responder(res, 404, { message: 'No existe' })

  if (req.method === 'PUT') {
    if (!cuerpoEsObjeto) return responder(res, 400, { message: 'Faltan los datos' })
    items[indice] = { ...items[indice], ...cuerpo, id }
    guardar()
    return responder(res, 200, items[indice])
  }

  if (req.method === 'DELETE') {
    items.splice(indice, 1)
    guardar()
    return responder(res, 204)
  }

  return responder(res, 405, { message: 'Método no permitido' })
}

/**
 * Sirve los JSON de la carpeta /database (fuera de frontend/) en la ruta /database/*,
 * en `npm run dev` y `npm run preview`, y simula las escrituras de las colecciones editables
 * (ver `escribirColeccion`). Se reemplaza por la API real cuando exista el backend.
 */
function servirDatabase() {
  function middleware(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return escribirColeccion(req, res)

    const nombre = decodeURIComponent(req.url.split('?')[0])
    const archivo = path.join(carpetaDatabase, nombre)

    const dentroDeDatabase = archivo.startsWith(carpetaDatabase + path.sep)
    if (!dentroDeDatabase || !archivo.endsWith('.json') || !fs.existsSync(archivo)) {
      res.statusCode = 404
      return res.end()
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    fs.createReadStream(archivo).pipe(res)
  }

  return {
    name: 'servir-database',
    configureServer(server) {
      server.middlewares.use('/database', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/database', middleware)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    servirDatabase(),
  ],
})
