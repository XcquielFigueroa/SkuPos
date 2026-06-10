import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// NOTAS Y APUNTES PERSONALES
// Este es el script donde se crean las funciones que React consumirá, se llaman invocándolas desde el main/index.js
// Las funciones a utilizar se almacenan dentro del objeto api, dándoles un nombre y la función que invoca

// Custom APIs for renderer
const api = {
  obtenerImpresoras: () => ipcRenderer.invoke('obtener-impresoras'),
  buscarProducto: (codigo) => ipcRenderer.invoke('db:buscar-producto', codigo),
  buscarPorNombre: (termino) => ipcRenderer.invoke('db:buscar-productos-por-nombre', termino),
  insertarProducto: (producto) => ipcRenderer.invoke('db:insertar-producto', producto),
  codigoEscaneado: (callback) => {
    const listener = (event, codigo) => callback(codigo)
    ipcRenderer.on('lector:nuevo-codigo', listener)
    return () => {
      ipcRenderer.removeListener('lector:nuevo-codigo', listener)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
