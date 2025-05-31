'use client'

import { useState, useEffect } from 'react'
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
  const [filteredCars, setFilteredCars] = useState([])
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

  const fetchCars = async () => {
    try {
      setIsLoading(true)
      
      // Para simplicidad, usaremos cookies httpOnly en lugar de headers Bearer
      const response = await fetch('/api/cars/admin', {
        credentials: 'include' // Incluir cookies
      })

      if (response.ok) {
        const data = await response.json()
        setCars(data)
        setFilteredCars(data)
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
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    filterCars(value, statusFilter, vendidoFilter)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    filterCars(searchTerm, value, vendidoFilter)
  }

  const handleVendidoFilter = (value) => {
    setVendidoFilter(value)
    filterCars(searchTerm, statusFilter, value)
  }

  const filterCars = (search, status, vendido) => {
    let filtered = cars

    if (search) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase()) ||
        car.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(car => car.status === status)
    }

    if (vendido !== 'all') {
      const isVendido = vendido === 'true'
      filtered = filtered.filter(car => car.vendido === isVendido)
    }

    setFilteredCars(filtered)
  }

  const handleAddCar = () => {
    setSelectedCar(null)
    setShowCarForm(true)
  }

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setShowCarForm(true)
  }

  const handleDeleteCar = (car) => {
    setCarToDelete(car)
  }

  const handleCarSaved = () => {
    setShowCarForm(false)
    setSelectedCar(null)
    fetchCars()
    toast({
      title: 'Éxito',
      description: selectedCar ? 'Auto actualizado correctamente' : 'Auto creado correctamente'
    })
  }

  const handleCarDeleted = () => {
    setCarToDelete(null)
    fetchCars()
    toast({
      title: 'Éxito',
      description: 'Auto eliminado correctamente'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price)
  }

  useEffect(() => {
    fetchCars()
  }, [])

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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {car.year} • {car.mileage.toLocaleString()} km
                </p>
                <p className="text-base sm:text-lg font-bold text-green-600">
                  {formatPrice(car.price)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {car.description}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCar(car)}
                    className="p-2"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCar(car)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[60px] sm:max-w-none">
                  ID: {car.id}
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
          onDelete={handleCarDeleted}
        />
      )}
    </div>
  )
} 