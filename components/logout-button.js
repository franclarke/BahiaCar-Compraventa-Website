'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      // En producción, podríamos enviar este error a un servicio de logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en logout:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3"
    >
      <LogOut className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      <span className="text-xs sm:text-sm">{isLoading ? 'Saliendo...' : 'Salir'}</span>
    </Button>
  )
} 