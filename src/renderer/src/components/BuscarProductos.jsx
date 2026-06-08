import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export default function BuscarProducto({ esActivo }) {
  const [codigoBuscar, setCodigoBuscar] = useState('')
  const [inputCodigo, setInputCodigo] = useState('')

  useEffect(() => {
    if (!esActivo) return

    const removerListener = window.api.codigoEscaneado((codigo) => {
      setInputCodigo(codigo)
      setCodigoBuscar(codigo)
      console.log(codigo)
    })

    return () => {
      if (typeof removerListener === 'function') removerListener()
    }
  }, [esActivo])

  const { data: producto, isLoading } = useQuery({
    queryKey: ['producto', codigoBuscar],
    queryFn: () => window.api.buscarProducto(codigoBuscar),
    enabled: !!codigoBuscar
  })

  const handleBuscar = (e) => {
    e.preventDefault()
    setCodigoBuscar(inputCodigo)
  }

  return (
    <div>
      <div className="bg-white flex-col m-2 p-5 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wide hidden">
          buscar producto
        </h2>
        <form
          onSubmit={handleBuscar}
          className="flex gap-0 border border-emerald-600 rounded overflow-hidden"
        >
          <input
            type="text"
            placeholder="escanear o escribir código..."
            value={inputCodigo}
            onChange={(e) => setInputCodigo(e.target.value)}
            className="pl-3 pr-2 py-2 text-sm text-gray-500 placeholder-gray-400 w-full outline-none"
          />
          <button
            type="submit"
            className="flex gap-1 bg-emerald-600 text-white px-4 hover:bg-emerald-700 transition items-center justify-center"
          >
            <Search size={18} />
          </button>
        </form>
        <div className="flex mt-4 bg-transparent justify-center">
          {isLoading && <p className="text-gray-500 text-sm">buscando producto...</p>}
          {!isLoading && !producto && codigoBuscar && (
            <p className="text-red-500 text-sm">el producto no está registrado</p>
          )}
          {!isLoading && producto && (
            <div className="flex-col w-full justify-center bg-white border border-gray-200 p-4 rounded text-sm text-gray-700">
              <div className="w-20 h-20 border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400 rounded mb-2 mx-auto">
                imagen
              </div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide text-center">
                {producto.nombre}
              </h3>
              <p className="text-[11px] text-gray-400 font-mono text-center mb-2">
                sku: {producto.codigo_barras}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs text-gray-500 font-medium">
                <span>stock: {producto.stock}</span>
                <span className="font-mono text-gray-700">$CLP {producto.precio.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
