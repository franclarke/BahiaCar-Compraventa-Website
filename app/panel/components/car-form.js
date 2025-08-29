'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { DynamicSelectAdmin } from '@/components/ui/dynamic-select-admin'

export default function CarForm({ car, onClose, onSave }) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'USED',
    mileage: '',
    price: '',
    transmission: '',
    type: '',
    fuelType: '',
    description: '',
    vendido: false
  })
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [removeExistingImages, setRemoveExistingImages] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        status: car.status || 'USED',
        mileage: car.mileage || '',
        price: car.price || '',
        transmission: car.transmission || '',
        type: car.type || '',
        fuelType: car.fuelType || '',
        description: car.description || '',
        vendido: car.vendido || false
      })
      setExistingImages(car.images || [])
    }
  }, [car])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? value : value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      vendido: checked
    }))
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return
    
    // Validaciones antes del procesamiento
    const validFiles = []
    const invalidFiles = []
    
    for (const file of files) {
      // Validar que el archivo existe y tiene contenido
      if (!file || file.size === 0) {
        invalidFiles.push({ file: file?.name || 'Archivo sin nombre', reason: 'Archivo vacío o inválido' })
        continue
      }
      
      // Validar tipo de archivo (más permisivo para móviles)
      const isValidImage = file.type.startsWith('image/') || 
                          /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      
      if (!isValidImage) {
        invalidFiles.push({ file: file.name, reason: 'No es una imagen válida. Use JPG, PNG, GIF o WEBP' })
        continue
      }
      
      // Validar tamaño (15MB máximo para dar más margen en móviles)
      if (file.size > 15 * 1024 * 1024) {
        invalidFiles.push({ file: file.name, reason: 'Archivo muy grande (máx 15MB)' })
        continue
      }
      
      // Comprimir imagen si es necesario
      try {
        const compressedFile = await compressImage(file)
        validFiles.push(compressedFile)
      } catch (error) {
        console.error('Error comprimiendo imagen:', error)
        // En lugar de rechazar completamente, intentar usar el archivo original
        if (file.size <= 10 * 1024 * 1024) {
          console.warn('Usando archivo original sin compresión:', file.name)
          validFiles.push(file)
        } else {
          invalidFiles.push({ file: file.name, reason: 'Error al procesar la imagen' })
        }
      }
    }
    
    // Mostrar errores si los hay
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.map(item => `${item.file}: ${item.reason}`).join('\n')
      toast({
        title: 'Algunos archivos no son válidos',
        description: errorMessage,
        variant: 'destructive'
      })
    }
    
    // Mostrar mensaje de éxito si se procesaron archivos
    if (validFiles.length > 0) {
      toast({
        title: 'Imágenes cargadas',
        description: `${validFiles.length} imagen${validFiles.length > 1 ? 'es' : ''} procesada${validFiles.length > 1 ? 's' : ''} correctamente`,
        variant: 'default'
      })
    }
    
    // Agregar archivos válidos a la lista existente
    setImages(prev => [...prev, ...validFiles])
    
    // Limpiar el input para permitir seleccionar los mismos archivos otra vez
    e.target.value = ''
  }

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // Limpiar URLs de objeto para liberar memoria
      if (prev[index]) {
        URL.revokeObjectURL(URL.createObjectURL(prev[index]))
      }
      return newImages
    })
  }
  
  // Función para comprimir imágenes con mejor soporte móvil
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      // Si el archivo es menor a 2MB, no comprimir
      if (file.size < 2 * 1024 * 1024) {
        resolve(file)
        return
      }
      
      // Verificar soporte para canvas y toBlob
      if (!HTMLCanvasElement.prototype.toBlob) {
        // Fallback para navegadores sin soporte nativo
        console.warn('Canvas toBlob no soportado, enviando archivo original')
        resolve(file)
        return
      }
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      // Timeout para evitar cuelgues
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout procesando imagen'))
      }, 15000)
      
      img.onload = () => {
        try {
          clearTimeout(timeoutId)
          
          // Calcular nuevas dimensiones manteniendo aspect ratio
          const maxWidth = 1920
          const maxHeight = 1080
          let { width, height } = img
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height)
          
          // Usar diferentes métodos según la disponibilidad
          if (canvas.toBlob) {
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                console.warn('toBlob falló, usando archivo original')
                resolve(file)
              }
            }, 'image/jpeg', 0.8)
          } else {
            // Fallback para navegadores sin toBlob
            try {
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
              const byteString = atob(dataUrl.split(',')[1])
              const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
              
              const ab = new ArrayBuffer(byteString.length)
              const ia = new Uint8Array(ab)
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
              }
              
              const compressedFile = new File([ab], file.name, {
                type: mimeString,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } catch (fallbackError) {
              console.warn('Fallback de compresión falló, usando archivo original:', fallbackError)
              resolve(file)
            }
          }
        } catch (error) {
          console.warn('Error en compresión, usando archivo original:', error)
          resolve(file)
        }
      }
      
      img.onerror = () => {
        clearTimeout(timeoutId)
        console.warn('Error cargando imagen para compresión, usando archivo original')
        resolve(file)
      }
      
      // Crear URL del objeto de forma segura
      try {
        const objectUrl = URL.createObjectURL(file)
        img.src = objectUrl
        
        // Limpiar URL después de un tiempo
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl)
        }, 30000)
      } catch (error) {
        clearTimeout(timeoutId)
        console.warn('Error creando object URL, usando archivo original:', error)
        resolve(file)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Agregar datos del auto con conversión de números
      Object.keys(formData).forEach(key => {
        let value = formData[key]
        // Convertir campos numéricos vacíos a números válidos
        if ((key === 'mileage' || key === 'price') && (value === '' || value === null)) {
          value = key === 'mileage' ? 0 : 0  // mileage puede ser 0, price requerido será validado por HTML
        }
        formDataToSend.append(key, value)
      })

      // Si es edición, agregar ID
      if (car) {
        formDataToSend.append('id', car.id)
      }

      // Agregar imágenes
      if (car) {
        // Para edición
        images.forEach(image => {
          formDataToSend.append('newImages', image)
        })
        formDataToSend.append('removeImages', removeExistingImages)
      } else {
        // Para creación
        images.forEach(image => {
          formDataToSend.append('images', image)
        })
      }

      const url = '/api/cars/admin'
      const method = car ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: 'include'
      })

      if (response.ok) {
        // Limpiar URLs de objeto para liberar memoria
        images.forEach(image => {
          if (typeof image === 'object') {
            URL.revokeObjectURL(URL.createObjectURL(image))
          }
        })
        
        toast({
          title: 'Éxito',
          description: car ? 'Auto actualizado correctamente' : 'Auto creado correctamente',
          variant: 'default'
        })
        
        onSave()
      } else {
        const error = await response.json()
        
        // Manejo específico de errores comunes en móviles
        let errorMessage = error.error || 'Error al guardar el auto'
        
        if (error.error && error.error.includes('413')) {
          errorMessage = 'Las imágenes son muy grandes. Intenta con imágenes más pequeñas.'
        } else if (error.error && error.error.includes('timeout')) {
          errorMessage = 'La conexión es lenta. Intenta con menos imágenes o una mejor conexión.'
        } else if (error.error && error.error.includes('network')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.'
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } catch (error) {
      // En producción, podríamos enviar este error a un servicio de logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Error guardando auto:', error)
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl">
            {car ? 'Editar Auto' : 'Agregar Nuevo Auto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">Marca *</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="Ej: Toyota"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">Modelo *</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                placeholder="Ej: Corolla"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">Año *</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="USED">Usado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm font-medium">Kilometraje</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                min="0"
                placeholder="Ej: 50000"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Precio *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 15000"
                className="text-sm sm:text-base"
              />
            </div>

            <DynamicSelectAdmin
              category="TRANSMISSION"
              value={formData.transmission}
              onValueChange={(value) => handleSelectChange('transmission', value)}
              label="Transmisión"
              placeholder="Seleccionar transmisión"
              className="text-sm sm:text-base"
            />

            <DynamicSelectAdmin
              category="TYPE"
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
              label="Tipo de Vehículo"
              placeholder="Seleccionar tipo"
              className="text-sm sm:text-base"
            />

            <DynamicSelectAdmin
              category="FUEL_TYPE"
              value={formData.fuelType}
              onValueChange={(value) => handleSelectChange('fuelType', value)}
              label="Tipo de Combustible"
              placeholder="Seleccionar combustible"
              className="text-sm sm:text-base"
            />

            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="vendido"
                  checked={formData.vendido}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="vendido" className="text-sm font-medium">Vendido</Label>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Descripción detallada del vehículo..."
              className="text-sm sm:text-base resize-none"
            />
          </div>

          {/* Imágenes existentes (solo en edición) */}
          {car && existingImages.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm font-medium">Imágenes Actuales</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-20 sm:h-24 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="removeExistingImages"
                  checked={removeExistingImages}
                  onCheckedChange={setRemoveExistingImages}
                />
                <Label htmlFor="removeExistingImages" className="text-sm">Eliminar todas las imágenes existentes</Label>
              </div>
            </div>
          )}

          {/* Nuevas imágenes */}
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="images" className="text-sm font-medium">
              {car ? 'Agregar más imágenes' : 'Imágenes'}
            </Label>
            <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-4 sm:p-6 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <div className="mt-3 sm:mt-4">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {car ? 'Seleccionar imágenes adicionales' : 'Seleccionar imágenes'}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm text-gray-500">
                    JPG, PNG, GIF, WEBP hasta 15MB cada una
                  </span>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('images').click()}
                    className="text-sm"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Seleccionar Imágenes
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview de nuevas imágenes */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-20 sm:h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isLoading ? 'Guardando...' : (car ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 