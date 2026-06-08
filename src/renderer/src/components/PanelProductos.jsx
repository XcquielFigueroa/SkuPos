import { useState } from 'react'
import BuscarProducto from './BuscarProductos'
import RegistroProducto from './RegistroProducto'

export default function PanelProductos() {
  const [seccionActiva, setSeccionActiva] = useState('buscar')

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSeccionActiva('buscar')}
          className={`px-4 py-2 text-xs font-bold rounded uppercase tracking-wide transition border ${
            seccionActiva === 'buscar'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Modo Ventas (Buscar)
        </button>
        <button
          onClick={() => setSeccionActiva('registrar')}
          className={`px-4 py-2 text-xs font-bold rounded uppercase tracking-wide transition border ${
            seccionActiva === 'registrar'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Modo Almacén (Registrar)
        </button>
      </div>

      <div className="flex gap-4">
        <BuscarProducto esActivo={seccionActiva === 'buscar'} />
        <RegistroProducto esActivo={seccionActiva === 'registrar'} />
      </div>
    </div>
  )
}
