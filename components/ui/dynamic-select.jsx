'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export function DynamicSelect({ 
  category, 
  value, 
  onValueChange, 
  placeholder = 'Seleccionar...', 
  label,
  className = '',
  required = false,
  disabled = false 
}) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newOptionValue, setNewOptionValue] = useState('')
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const loadOptions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cars/options?category=${category}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar opciones')
      }
      
      const data = await response.json()
      setOptions(data)
    } catch (error) {
      console.error('Error cargando opciones:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las opciones',
        variant: 'destructive',
      })
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [category, toast])

  // Cargar opciones al montar el componente
  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  const handleCreateOption = async () => {
    if (!newOptionValue.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un valor',
        variant: 'destructive',
      })
      return
    }

    try {
      setCreating(true)
      const response = await fetch('/api/cars/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category,
          value: newOptionValue.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear la opción')
      }

      const newOption = await response.json()
      
      // Actualizar la lista de opciones
      setOptions(prev => [...prev, newOption])
      
      // Seleccionar automáticamente la nueva opción
      onValueChange(newOption.value)
      
      // Limpiar y cerrar el dialog
      setNewOptionValue('')
      setDialogOpen(false)
      
      toast({
        title: 'Éxito',
        description: 'Opción creada correctamente',
      })
    } catch (error) {
      console.error('Error creando opción:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const getCategoryDisplayName = (category) => {
    const names = {
      TRANSMISSION: 'transmisión',
      TYPE: 'tipo de vehículo',
      FUEL_TYPE: 'tipo de combustible',
    }
    return names[category] || category.toLowerCase()
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="flex gap-2">
        <Select 
          value={value} 
          onValueChange={onValueChange} 
          disabled={disabled || loading}
        >
          <SelectTrigger className={`flex-1 ${className}`}>
            <SelectValue placeholder={loading ? 'Cargando...' : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              disabled={disabled || loading}
              title={`Agregar nueva ${getCategoryDisplayName(category)}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Agregar nueva {getCategoryDisplayName(category)}
              </DialogTitle>
              <DialogDescription>
                Ingresa el nombre de la nueva {getCategoryDisplayName(category)} que deseas agregar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-option">
                  Nombre de la {getCategoryDisplayName(category)}
                </Label>
                <Input
                  id="new-option"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder={`Ej: Nueva ${getCategoryDisplayName(category)}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !creating) {
                      e.preventDefault()
                      handleCreateOption()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleCreateOption}
                disabled={creating || !newOptionValue.trim()}
              >
                {creating ? (
                  'Creando...'
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Crear
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 