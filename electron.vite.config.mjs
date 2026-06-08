import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // NOTAS PERSONALES Y APUNTES
  // better-sqlite3 descarga codigo y lo compila en .node, vite intenta leerlo y no lo entiende dando un error de compilación en electron
  // para evitarlo, configuramos en main el plugin externalizeDeps para que vite excluya a better-sqlite3
  // aca se cambió main: {} por lo de abajo. y se agregó la importación del plugin en la línea 2.
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['better-sqlite3'] })],
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
