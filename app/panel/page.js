import CarManagement from '@/app/panel/components/car-management'

export default function PanelPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Gestión de Autos
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Administra el inventario de vehículos: agrega nuevos autos, edita información y gestiona el estado de ventas.
        </p>
      </div>
      
      <CarManagement />
    </div>
  )
} 