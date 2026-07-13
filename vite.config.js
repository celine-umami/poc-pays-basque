import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'url'

// Chemin absolu vers shared/layout.js (racine du projet)
const sharedLayoutPath = fileURLToPath(new URL('shared/layout.js', import.meta.url))

/**
 * Plugin Vite qui rend shared/layout.js accessible à l'URL /shared/layout.js.
 *
 * Pourquoi : les web components dans public/ ne passent pas par le pipeline
 * Vite et ne peuvent pas utiliser les imports relatifs. Ils doivent fetcher
 * le fichier comme une URL. Ce plugin le sert en dev et l'émet dans dist/ au build.
 *
 * React, lui, importe le fichier directement via un import relatif classique
 * ('../shared/layout.js') — sans passer par ce plugin.
 */
function sharedLayoutPlugin() {
  return {
    name: 'shared-layout',

    // Dev : sert shared/layout.js à l'URL /shared/layout.js
    configureServer(server) {
      server.middlewares.use('/shared/layout.js', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.end(readFileSync(sharedLayoutPath, 'utf-8'))
      })
    },

    // Build : émet le fichier dans dist/shared/layout.js
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'shared/layout.js',
        source: readFileSync(sharedLayoutPath, 'utf-8'),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), sharedLayoutPlugin()],
})
