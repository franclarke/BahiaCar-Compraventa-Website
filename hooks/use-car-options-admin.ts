import { useState, useEffect } from 'react'

interface CarOption {
  id: number
  category: string
  value: string
  isDefault: boolean
  createdAt: string
}

export function useCarOptionsAdmin(category: 'TRANSMISSION' | 'TYPE' | 'FUEL_TYPE') {
  const [options, setOptions] = useState<CarOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/cars/options/admin?category=${category}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Error al cargar opciones')
        }
        
        const data = await response.json()
        setOptions(data)
      } catch (err) {
        console.error('Error cargando opciones admin:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    loadOptions()
  }, [category])

  const refetch = async () => {
    const loadOptions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/cars/options/admin?category=${category}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Error al cargar opciones')
        }
        
        const data = await response.json()
        setOptions(data)
      } catch (err) {
        console.error('Error cargando opciones admin:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    await loadOptions()
  }

  return {
    options,
    loading,
    error,
    refetch
  }
} 