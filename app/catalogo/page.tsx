"use client";

import { useEffect, useState } from "react";
import { CarFilters } from "./components/car-filters";
import { CarCard } from "./components/car-card";
import type { FilterParams, Car } from "@/types/car";

export default function CatalogoPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar autos desde la API
  const loadCars = async (filters: FilterParams = {}) => {
    try {
      setLoading(true);
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        console.error("Error en la API:", response.statusText);
        return;
      }

      const data: Car[] = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llama a la API la primera vez para cargar todos los autos
  useEffect(() => {
    loadCars();
  }, []);

  return (
    <div className="container mx-auto pt-20 pb-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Catálogo de Vehículos</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4">
          <CarFilters onFilterChange={loadCars} />
        </aside>
        <main className="md:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="bg-gray-200 aspect-[16/9]" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
              {cars.length === 0 && (
                <p className="text-center text-gray-500 col-span-full">
                  No se encontraron vehículos.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
