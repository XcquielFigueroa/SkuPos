import { useQuery } from '@tanstack/react-query'
import { Printer } from 'lucide-react'

export default function ComponentePrueba() {
  const { data: impresoras, isLoading } = useQuery({
    queryKey: ['impresoras-sistema'],
    queryFn: () => window.api.obtenerImpresoras()
  })

  if (isLoading) return <p>Cargando impresoras...</p>

  console.log()

  return (
    <div>
      <div className="bg-white m-2 p-6 border border-gray-200 rounded-lg shadow-sm max-w-md">
        <h1 className="flex items-center gap-2 font-bold text-sm text-gray-500 uppercase tracking-wide mb-4">
          <Printer size={18} className="text-gray-400" /> Impresoras disponibles
        </h1>
        <div className="relative">
          <select className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition appearance-none cursor-pointer">
            {impresoras && impresoras.length > 0 ? (
              impresoras.map((imp) => (
                <option key={imp.name} value={imp.name}>
                  {imp.displayName} {imp.isDefault ? '(Predeterminada)' : ''}
                </option>
              ))
            ) : (
              <option>No se encontraron impresoras</option>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://w3.org" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
