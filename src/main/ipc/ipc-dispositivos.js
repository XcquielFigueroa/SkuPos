import { SerialPort } from 'serialport'
import { ipcMain } from 'electron'

// APUNTES
// EN ESTE SCRIPT AGRUPAMOS LAS FUNCIONES DESTINADAS A CONFIGURAR LOS DISPOSITIVOS COMO EL LECTOR DE CÓDIGOS Y LA IMPRESORA TÉRMICA PARA LAS BOLETAS
// LA IDEA ES TENER LAS FUNCIONES YA SEAN HANDLES O NO, SEPARADAS POR PROPÓSITO
// ESTAS CONFIGURACIONES ESTÁN HARDCODEADAS ACÁ PERO LA IDEA MAS ADELANTE ES PODER MODIFICARLA DESDE EL FRONTEND

// EN ESTA FUNCIÓN CONFIGURAMOS EL LECTOR DE CODIGO DE BARRAS
// LA INFORMACIÓN VIAJA EN BYTES A TRAVÉS DEL PUERTO COM A LA APLICACIÓN CON WEBCONTENTS, PARA ESTO NECESITO APUNTAR A LA VENTANA DE LA APP QUE ESTÁ RECIBIDA COMO PARÁMETRO
// ESTA FUNCIÓN DEBE LLAMARSE DESPUES DE HABER CARGADO COMPLETAMENTE LA APLICACION Y NO BASTA CON whenReady() YA QUE HASTA ESTE PUNTO AÚN LA VENTANA ES NULL
// DEBIDO A ESTO, HAY QUE LLAMARLA EN on('ready-to-show') PARA ASEGURARSE QUE HA CARGADO TODO
export function inicializarLectorCodigosIpc(mainWindow) {
  const puerto = new SerialPort({
    path: 'COM3',
    baudRate: 9600
  })

  puerto.on('data', (buffer) => {
    const codigoTexto = buffer
      .toString()
      .replace(/[\r\n]/g, '')
      .trim()
    console.log(codigoTexto)

    if (mainWindow) {
      mainWindow.webContents.send('lector:nuevo-codigo', codigoTexto)
    }
  })

  puerto.on('error', (err) => {
    console.error('Error en puerto serie:', err.message)
  })
}

// ESTA FUNCION SOLO OBTIENE LA LISTA DE IMPRESORAS CONECTADAS AL PC Y LAS ENTREGA CON UN HANDLE AL FRONTEND
// WEBCONTENTS ES EL MOTOR DE ELECTRON QUE RENDERIZA Y CONTROLA UNA PAGINA O VENTANA (CREADA CON BROWSERWINDOW, CADA UNA TIENE SU WEBCONTENTS)
// EN ESTE CASO NOS SIRVE PARA OBTENER LA LISTA DE IMPRESORAS YA QUE WEBCONTENTS ES QUIEN TIENE ACCESO A ESA INFORMACION DEL SISTEMA
// PARA ESO SOLO HACEMOS UN CALLBACK QUE APUNTE AL WEBCONTENTS DE LA VENTANA USANDO event.sender Y LUEGO CON .getPrintersAsync() OBTENEMOS EL ARRAY DE IMPRESORAS
export function inicializarImpresorasIpc() {
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
