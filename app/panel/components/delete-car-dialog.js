'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export default function DeleteCarDialog({ car, onClose, onDelete }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/cars/admin?id=${car.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        onDelete()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Error al eliminar el auto',
          variant: 'destructive'
        })
      }
    } catch (error) {
      // En producción, podríamos enviar este error a un servicio de logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Error eliminando auto:', error)
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
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            Esta acción no se puede deshacer. Se eliminará permanentemente el auto{' '}
            <strong>{car.brand} {car.model} {car.year}</strong> y todas sus imágenes asociadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            onClick={onClose} 
            disabled={isLoading}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 