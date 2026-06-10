import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SaveIcon } from 'lucide-react'

export default function RegistroProducto({ esActivo }) {
  const queryClient = useQueryClient()

  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [nuevoCodigo, setNuevoCodigo] = useState('')
  const [nuevaImagen, setNuevaImagen] = useState(null)

  const agregarProductoMutation = useMutation({
    mutationFn: (nuevoProducto) => window.api.insertarProducto(nuevoProducto),
    onSuccess: (resultado) => {
      if (resultado.success) {
        alert('Producto agregado.')
        queryClient.invalidateQueries({ queryKey: ['producto'] })
        setNuevoNombre('')
        setNuevoPrecio('')
        setNuevoCodigo('')
        setNuevaImagen(null)
      } else {
        alert('Error al guardar producto: ' + resultado.error)
      }
    }
  })

  useEffect(() => {
    if (!esActivo) return

    const removerListener = window.api.codigoEscaneado((codigo) => {
      setNuevoCodigo(codigo)
      console.log(codigo)
    })

    return () => {
      if (typeof removerListener === 'function') removerListener()
    }
  }, [esActivo])

  const handleCrearProducto = async (e) => {
    e.preventDefault()

    let datosImagen = null

    if (nuevaImagen && nuevaImagen.length > 0) {
      const archivo = nuevaImagen[0]
      const arrayBuffer = await archivo.arrayBuffer()

      datosImagen = {
        nombreOriginal: archivo.name,
        buffer: new Uint8Array(arrayBuffer)
      }
    }

    agregarProductoMutation.mutate({
      codigo_barras: nuevoCodigo,
      nombre: nuevoNombre,
      precio: parseFloat(nuevoPrecio),
      stock: 10,
      imagen: datosImagen
    })
  }

  return (
    <div>
      <div className="bg-white flex-col m-2 p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-4">
          Registrar producto
        </h2>
        <form onSubmit={handleCrearProducto} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Código de Barras"
            value={nuevoCodigo}
            onChange={(e) => setNuevoCodigo(e.target.value)}
            required
            className="pl-3 pr-3 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-emerald-600 transition w-full"
          />
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
            className="pl-3 pr-3 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-emerald-600 transition w-full"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio de venta"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
            required
            className="pl-3 pr-3 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-emerald-600 transition w-full"
          />
          <label className="flex flex-col gap-1 cursor-pointer">
            <span className="text-xs font-semibold text-gray-500">Imagen de referencia</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNuevaImagen(e.target.files)}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </label>
          <button
            type="submit"
            className="flex gap-2 items-center justify-center bg-emerald-600 text-white p-2 rounded text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={agregarProductoMutation.isPending}
          >
            <SaveIcon size={18} />
            {agregarProductoMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
