import './assets/main.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// QueryClient gestiona la memoria caché de React, al crearla en este punto permito que los componentes que requieran de useQuery utilicen este mismo QueryClient
// compartiendo la misma memoria caché
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowsFocus: false,
      staleTime: 1000 * 60 * 5
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App></App>
    </QueryClientProvider>
  </StrictMode>
)
