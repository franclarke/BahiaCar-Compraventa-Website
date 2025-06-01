import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, Car, Home, Menu, X, Mail } from 'lucide-react'
import LogoutButton from '@/components/logout-button'

async function verifyAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return { isAuthenticated: false, user: null }
  }

  const result = verifyToken(token)
  return {
    isAuthenticated: result.success,
    user: result.success ? result.user : null
  }
}

export default async function PanelLayout({ children }) {
  const auth = await verifyAuth()

  if (!auth.isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo y título - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                Panel Admin
              </h1>
            </div>
            
            {/* Navegación - Responsive */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {/* Botón Home - Solo texto en pantallas grandes */}
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline text-xs sm:text-sm">Sitio Web</span>
                </Button>
              </Link>
              
              {/* Usuario - Responsive */}
              <div className="hidden md:block text-xs sm:text-sm text-gray-600 max-w-[120px] lg:max-w-none">
                <span className="hidden lg:inline">Bienvenido, </span>
                <span className="font-medium truncate">{auth.user?.username}</span>
              </div>
              
              {/* Botón logout */}
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
} 