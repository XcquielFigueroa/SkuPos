import { ipcMain } from 'electron'
import db from '../base-de-datos.js'
import path from 'path'
import fs from 'fs'
import { CARPETA_IMAGENES } from '../configurar-carpeta-imagenes.js'

// APUNTES
// LOS HANDLES O MANEJADORES EN ELECTRON SON "FUNCIONES" QUE SE ENCARGAN DE ENTREGARLE UN CALLBACK AL PROCESO PRINCIPAL
// ESTOS COMUNICAN EL FRONTEND DE LA APLICACION CON EL BACKEND DE ELECTRON YA ESTE FUNCIONA CON UN PATRON DE INVOCACION Y RESPUESTA
// EN EL PROCESO PRINCIPAL DEL BACKEND, OSEA EL MAIN/INDEX.JS LOS UTILIZAMOS PARA RECIBIR LA PETICIÓN, PROCESAR LA TAREA Y RESPONDER AL FRONTEND A TRAVÉS DE PRELOAD/INDEX.JS
// SU SINTAXIS ES ipcMain.handle('CANAL', CALLBACK)

// Creamos una función para empaquetar los handles e iniciarlos en el index.js del main
// Para hacer las consultas a la base de datos usamos las funciones get(), prepare(), run() de better sqlite3
// La idea aca es:
//    * Un componente pide o envía datos a preload/index.js llamando una funcion guardada en el objeto api usando queryFn: () => window.api.buscar(datos) o mutationFn: (datos) => window.api.insertar(datos)
//    * window.api.funcion: (datos) => ipcRenderer.invoke(canal) recibe los datos e invoca una accion que coincida con el nombre del canal y a la vez de devuelve una promesa
//    * ipcMain.handle(canal, async (event, datos)) recibe la peticion, ejecuta el codigo correspondiente y devuelve los datos o respuesta que viajan al componente.

export function inicializarProductosIpc() {
  ipcMain.handle('db:insertar-producto', async (event, producto) => {
    const { codigo_barras, nombre, precio, stock, imagen } = producto
    let nombreArchivoFinal = null

    if (imagen && imagen.buffer) {
      try {
        const extension = path.extname(imagen.nombreOriginal) || '.jpg'
        nombreArchivoFinal = `${codigo_barras}${extension}`
        const rutaDestinoCompleta = path.join(CARPETA_IMAGENES, nombreArchivoFinal)
        const datosBinarios = Buffer.from(Object.values(imagen.buffer))
        fs.writeFileSync(rutaDestinoCompleta, datosBinarios)
      } catch (error) {
        console.error('Error al guardar imagen.', error)
      }
    }

    try {
      const statement = db.prepare(
        'INSERT INTO productos (codigo_barras, nombre, precio, stock, imagen_referencial) VALUES (?, ?, ?, ?, ?)'
      )
      const info = statement.run(codigo_barras, nombre, precio, stock, nombreArchivoFinal)
      return { success: true, id: info.lastInsertRowid }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Para hacer una busqueda por codigo de barras ejecutamos una consulta SELECT donde coincida el numero de barras escaneado y retornamos solo el registro coincidente
  ipcMain.handle('db:buscar-producto', async (event, codigo_barras) => {
    const statement = db.prepare('SELECT * FROM productos WHERE codigo_barras = ?')
    const resultado = statement.get(codigo_barras)
    return resultado || null
  })

  // Para hacer un panel de busqueda rápida que busque productos al escribir ejecutamos un SELECT con LIKE y retornamos un Array con los resultados obtenidos de all()
  // primero revisamos que la barra tenga algo escrito y que no solo sean espacios
  // Luego hacemos la consulta a la base de datos y retornamos todo registro en un array
  ipcMain.handle('db:buscar-productos-por-nombre', async (event, termino) => {
    try {
      if (!termino || termino.trim() === '') return []

      const statement = db.prepare('SELECT * FROM productos WHERE nombre LIKE ? LIMIT 10')
      const terminoFormateado = `%${termino.toLowerCase().trim()}%`
      const resultados = statement.all(terminoFormateado)
      return resultados
    } catch (error) {
      console.error('Error en la búsqueda:', error.message)
      return []
    }
  })
}
