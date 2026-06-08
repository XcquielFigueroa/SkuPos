import { SerialPort } from 'serialport'

export function initBarcodeReaderIpc(mainWindow) {
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
