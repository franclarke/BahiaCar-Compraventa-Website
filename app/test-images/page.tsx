'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Car {
  id: number
  brand: string
  model: string
  images: string[]
}

export default function TestImagesPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cars')
        
        if (!response.ok) {
          throw new Error('Error al cargar autos')
        }
        
        const data = await response.json()
        // Filtrar solo autos con imágenes
        const carsWithImages = data.filter((car: Car) => car.images && car.images.length > 0)
        setCars(carsWithImages.slice(0, 5)) // Solo los primeros 5
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const testImageLoad = (imageUrl: string) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(true)
      img.onerror = () => reject(false)
      img.src = imageUrl
    })
  }

  const handleTestImage = async (imageUrl: string) => {
    try {
      await testImageLoad(imageUrl)
      alert('✅ Imagen carga correctamente')
    } catch {
      alert('❌ Error al cargar la imagen')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prueba de Imágenes de Supabase</h1>
        
        {cars.length === 0 ? (
          <p className="text-center text-gray-500">No hay autos con imágenes para mostrar</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {car.brand} {car.model}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    ID: {car.id} | Imágenes: {car.images.length}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {car.images.map((imageUrl, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`${car.brand} ${car.model} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            console.error('Error cargando imagen:', imageUrl)
                            e.currentTarget.style.display = 'none'
                          }}
                          onLoad={() => {
                            console.log('Imagen cargada exitosamente:', imageUrl)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 truncate flex-1 mr-2">
                          {imageUrl}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestImage(imageUrl)}
                        >
                          Probar
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 