import { ipcMain } from 'electron'

// APUNTES
// Empaquetado del handle de las impresoras
export function initPrintersIpc() {
  ipcMain.handle('obtener-impresoras', async (event) => {
    const webContents = event.sender

    try {
      const impresoras = await webContents.getPrintersAsync()
      return impresoras
    } catch (error) {
      console.error('Error al leer impresoras', error)
      return []
    }
  })
}
