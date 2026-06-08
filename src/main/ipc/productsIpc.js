import { ipcMain } from 'electron'
import db from '../database.js'

// APUNTES
// Creamos una función para empaquetar los handles e iniciarlos en el index.js del main
export function initProductosIpc() {
  ipcMain.handle('db:buscar-producto', async (event, codigo_barras) => {
    const statement = db.prepare('SELECT * FROM productos WHERE codigo_barras = ?')
    const resultado = statement.get(codigo_barras)
    return resultado || null
  })

  ipcMain.handle('db:insertar-producto', async (event, producto) => {
    const { codigo_barras, nombre, precio, stock } = producto
    try {
      const statement = db.prepare(
        'INSERT INTO productos (codigo_barras, nombre, precio, stock) VALUES (?, ?, ?, ?)'
      )
      const info = statement.run(codigo_barras, nombre, precio, stock)
      return { success: true, id: info.lastInsertRowId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
