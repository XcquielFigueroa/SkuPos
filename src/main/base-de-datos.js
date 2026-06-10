import { app } from 'electron'
import path from 'path'
import Database from 'better-sqlite3'

// APUNTES
// Para no ensuciar la base de datos de producción, creamos una base de datos para desarrollo separada de producción
const isDev = !app.isPackaged

const dbPath = isDev
  ? path.join(__dirname, '../../productos_dev.db')
  : path.join(app.getPath('userData'), 'productos_produccion.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_barras TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    imagen_referencial TEXT
  );
  
  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id INTEGER,
  producto_id INTEGER,
  cantidad INTEGER NOT NULL,
  precio_unitario REAL NOT NULL,
  FOREIGN KEY(venta_id) REFERENCES ventas(id),
  FOREIGN KEY(producto_id) REFERENCES productos(id)
  );
`)

export default db
