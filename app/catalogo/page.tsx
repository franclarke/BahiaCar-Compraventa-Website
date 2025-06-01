"use client";

import { useState, useEffect, useCallback } from "react";
import { CarCard } from "./components/car-card";
import { CarFilters } from "./components/car-filters";
import { Car } from "@prisma/client";

export default function CatalogoPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función de búsqueda memorizada para evitar recrearla en cada render.
  const fetchCars = useCallback(async (filters: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Error al cargar los autos");
      }
      const data: Car[] = await response.json();
      setCars(data);
    } catch (err: any) {
      console.error("Error al cargar los autos:", err);
      setError(err.message || "Error desconocido");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Se ejecuta la consulta al montar el componente.
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filtros */}
          <aside className="w-full lg:w-72 xl:w-80">
            <CarFilters onFilterChange={fetchCars} />
          </aside>

          {/* Lista de Autos */}
          <section className="flex-1 min-w-0">
            {/* Header con contador de resultados */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Catálogo de Vehículos
              </h1>
              {!loading && !error && (
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  {cars.length} {cars.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
                </p>
              )}
            </div>

            {error && (
              <div
                className="bg-red-100 text-red-600 p-3 sm:p-4 rounded mb-4 sm:mb-6 text-sm sm:text-base"
                role="alert"
              >
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[280px] sm:h-[320px] bg-gray-200 rounded-lg animate-pulse"
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : (
              <>
                {cars.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {cars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8 sm:py-12">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        No se encontraron vehículos
                      </h3>
                      <p className="text-sm sm:text-base">
                        No hay autos que coincidan con los filtros seleccionados. 
                        Intenta ajustar tus criterios de búsqueda.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
