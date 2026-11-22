import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

const carpetaDatabase = fileURLToPath(new URL('../database', import.meta.url))

/**
 * Sirve los JSON de la carpeta /database (fuera de frontend/) en la ruta /database/*,
 * en `npm run dev` y `npm run preview`. Se reemplaza por la API real cuando exista el backend.
 */
function servirDatabase() {
  function middleware(req, res) {
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
