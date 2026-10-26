import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { montar } from './scripts/montar.js'

// Dev igual ao build: cada página é renderizada no servidor a cada request
function ssrDev() {
  return {
    name: 'rdg-ssr-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl.split('?')[0]
        if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next()
        try {
          const tpl = await server.transformIndexHtml(url, fs.readFileSync('index.html', 'utf8'))
          const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
          const r = render(url)
          res.statusCode = r.status
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(montar(tpl, r))
        } catch (e) {
          server.ssrFixStacktrace(e)
          next(e)
        }
      })
    },
  }
}

// Preview igual ao Caddy em produção: /rota -> dist/rota/index.html, senão 404.html
function rotasPreview() {
  return {
    name: 'rdg-rotas-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0]
        if (path.extname(url)) return next()
        const arquivo = path.join(url, 'index.html')
        if (fs.existsSync(path.join('dist', arquivo))) req.url = arquivo
        else req.url = '/404.html' // shortcut: preview responde 200 na 404; o status real vem do Caddy
        next()
      })
    },
  }
}

export default defineConfig({
  appType: 'custom',
  plugins: [react(), ssrDev(), rotasPreview()],
  build: { ssrEmitAssets: true },
})
