"use client";

import { useState, useEffect } from "react";
import { CarCard } from "./components/car-card";
import { CarFilters } from "./components/car-filters";
import { Car } from "@prisma/client";

export default function CatalogoPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars({});
  }, []);

  const fetchCars = async (filters: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Error al cargar los autos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros */}
          <aside className="w-full md:w-64">
            <CarFilters onFilterChange={fetchCars} />
          </aside>

          {/* Lista de Autos */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
                {cars.length === 0 && (
                  <p className="text-center text-gray-500 col-span-full">
                    No se encontraron autos con los filtros seleccionados
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
