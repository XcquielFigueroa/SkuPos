import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { inicializarDirectorio, configurarProtocoloImagenes } from './configurar-carpeta-imagenes'
import { inicializarProductosIpc } from './ipc/ipc-productos'
import { inicializarLectorCodigosIpc, inicializarImpresorasIpc } from './ipc/ipc-dispositivos'

// NOTAS PERSONALES Y APUNTES
// Este archivo vendría a ser como el script principal para electron o el sistema detrás del navegador/interfaz de electron
// En este script es donde se crean las funciones que necesitan de recursos o dispositivos del sistema. React no tiene acceso a eso directamente.
// Para usarlas y hacerlas llegar a React hay que comunicarlas a través de IPC
// Usamos ipcMain.Handle(función) para crear la función a ejecutar y exponerla al render en preload/index.js
// Devuelven una promesa, por lo que idealmente son async.

let mainWindow

// Registramos nuestro nuevo esquema en los protocolos de confianza con los privilegios de saltarse el Content Security Policy y que permita envio de datos con fetch usando stream: true
protocol.registerSchemesAsPrivileged([
  { scheme: 'app-img', privileges: { bypassCSP: true, stream: true } }
])

function createWindow() {
  // Crea la ventana principal de la aplicación
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Muestra la pantalla una vez han cargado los elementos de lo contrario se vería en blanco y luego cargaría los elementos
  // Llamamos a initBarcodeReaderIpc aca para evitar entregar mainWindow como nulo
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    inicializarLectorCodigosIpc(mainWindow)
  })

  // Evita que los links dentro de la aplicación se abran como un navegador, para permitirlo colocar 'allow' en vez de 'deny'
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Conecta al servidor de vite cuando está en modo producción, una vez compilada se conecta al archivo directamente
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Llamamos a las funciones para inicializar los handles
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  inicializarDirectorio()
  configurarProtocoloImagenes(protocol, net)
  inicializarProductosIpc()
  inicializarImpresorasIpc()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Termina el programa al cerrar la ventana en windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
