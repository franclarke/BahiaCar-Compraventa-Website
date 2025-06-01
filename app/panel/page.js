"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Mail } from 'lucide-react';
import CarManagement from '@/app/panel/components/car-management';
import MessageManagement from '@/app/panel/components/message-management';

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState('cars');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Administra el inventario de vehículos y los mensajes de contacto.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="cars" className="flex items-center gap-2 py-3">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Gestión de</span> Autos
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 py-3">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Gestión de</span> Mensajes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Gestión de Autos
            </h2>
            <p className="text-gray-600">
              Agrega nuevos autos, edita información y gestiona el estado de ventas.
            </p>
          </div>
          <CarManagement />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <MessageManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
} 