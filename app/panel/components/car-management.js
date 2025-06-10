'use client'

import { useState, useEffect, useOptimistic, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Eye, DollarSign } from 'lucide-react'
import CarForm from './car-form'
import DeleteCarDialog from './delete-car-dialog'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function CarManagement() {
  const [cars, setCars] = useState([])
  const [optimisticCars, setOptimisticCars] = useOptimistic(
    cars,
    (currentCars, action) => {
      switch (action.type) {
        case 'DELETE_CAR':
          return currentCars.filter(car => car.id !== action.carId)
        default:
          return currentCars
      }
    }
  )
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendidoFilter, setVendidoFilter] = useState('all')
  const [showCarForm, setShowCarForm] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [carToDelete, setCarToDelete] = useState(null)
  const { toast } = useToast()

  // Obtener token de auth para las peticiones
  const getAuthToken = async () => {
    try {
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        const data = await response.json()
        return data.token // Necesitaremos ajustar esto
      }
    } catch (error) {
      console.error('Error obteniendo token:', error)
    }
    return null
  }

  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Para simplicidad, usaremos cookies httpOnly en lugar de headers Bearer
      const response = await fetch('/api/cars/admin', {
        credentials: 'include' // Incluir cookies
      })

      if (response.ok) {
        const data = await response.json()
        setCars(data)
      } else {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los autos',
          variant: 'destructive'
        })
      }
    } catch (error) {
      // En producción, podríamos enviar este error a un servicio de logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Error cargando autos:', error)
      }
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Usar useMemo para filtrar los autos en lugar de useEffect para evitar bucles infinitos
  const filteredCars = useMemo(() => {
    let filtered = optimisticCars

    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(car => car.status === statusFilter)
    }

    if (vendidoFilter !== 'all') {
      const isVendido = vendidoFilter === 'true'
      filtered = filtered.filter(car => car.vendido === isVendido)
    }

    return filtered
  }, [optimisticCars, searchTerm, statusFilter, vendidoFilter])

  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handleStatusFilter = useCallback((value) => {
    setStatusFilter(value)
  }, [])

  const handleVendidoFilter = useCallback((value) => {
    setVendidoFilter(value)
  }, [])

  const handleAddCar = useCallback(() => {
    setSelectedCar(null)
    setShowCarForm(true)
  }, [])

  const handleEditCar = useCallback((car) => {
    setSelectedCar(car)
    setShowCarForm(true)
  }, [])

  const handleDeleteCar = useCallback((car) => {
    setCarToDelete(car)
  }, [])

  const handleCarSaved = useCallback(() => {
    setShowCarForm(false)
    setSelectedCar(null)
    fetchCars()
    toast({
      title: 'Éxito',
      description: selectedCar ? 'Auto actualizado correctamente' : 'Auto creado correctamente'
    })
  }, [selectedCar, fetchCars, toast])

  const handleOptimisticCarDelete = useCallback(async (carId) => {
    // Actualización optimista - eliminar inmediatamente de la UI
    setOptimisticCars({ type: 'DELETE_CAR', carId })
    
    try {
      const response = await fetch(`/api/cars/admin?id=${carId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Actualizar el estado real después de la eliminación exitosa
        setCars(prevCars => prevCars.filter(car => car.id !== carId))
        setCarToDelete(null)
        
        toast({
          title: 'Éxito',
          description: 'Auto eliminado correctamente'
        })
      } else {
        // Si falla, revertir la operación optimista
        const error = await response.json()
        
        // Recargar los datos para sincronizar con el servidor
        await fetchCars()
        
        toast({
          title: 'Error',
          description: error.error || 'Error al eliminar el auto',
          variant: 'destructive'
        })
      }
    } catch (error) {
      // Si hay error de red, revertir la operación optimista
      if (process.env.NODE_ENV === 'development') {
        console.error('Error eliminando auto:', error)
      }
      
      // Recargar los datos para sincronizar con el servidor
      await fetchCars()
      
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      })
    }
  }, [setOptimisticCars, setCars, setCarToDelete, fetchCars, toast])

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price)
  }, [])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Cargando autos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por marca, modelo o descripción..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="USED">Usado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vendidoFilter} onValueChange={handleVendidoFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Vendido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="false">Disponible</SelectItem>
                  <SelectItem value="true">Vendido</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleAddCar} 
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                size="default"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Auto</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de autos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCars.map(car => (
          <Card key={car.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {car.images && car.images.length > 0 ? (
                <Image
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
                <Badge 
                  variant={car.status === 'NEW' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {car.status === 'NEW' ? 'Nuevo' : 'Usado'}
                </Badge>
                {car.vendido && (
                  <Badge variant="destructive" className="text-xs">Vendido</Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-600">Año {car.year}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600 text-sm sm:text-base">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/catalogo/${car.id}`, '_blank')}
                    className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Ver</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCar(car)}
                    className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Editar</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCar(car)}
                    className="flex items-center justify-center space-x-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Eliminar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">No se encontraron autos con los filtros aplicados.</p>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      {showCarForm && (
        <CarForm
          car={selectedCar}
          onClose={() => setShowCarForm(false)}
          onSave={handleCarSaved}
        />
      )}

      {carToDelete && (
        <DeleteCarDialog
          car={carToDelete}
          onClose={() => setCarToDelete(null)}
          onDelete={() => handleOptimisticCarDelete(carToDelete.id)}
        />
      )}
    </div>
  )
} 