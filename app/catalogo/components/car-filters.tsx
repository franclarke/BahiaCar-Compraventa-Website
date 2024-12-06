"use client";

import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { FilterParams } from "@/types/car";
import { CarStatus } from "@prisma/client";

interface CarFiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

const TRANSMISSION_OPTIONS = [
  { value: "Automatica", label: "Automática" },
  { value: "Manual", label: "Manual" },
];

export function CarFilters({ onFilterChange }: CarFiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({});
  const [debouncedCallback] = useDebounce(onFilterChange, 300);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Cargar marcas
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cars/brands");
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        }
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  // Cargar tipos
  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cars/types");
        if (response.ok) {
          const data = await response.json();
          setTypes(data);
        }
      } catch (error) {
        console.error("Error al cargar tipos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  // Cargar modelos cuando se selecciona una marca
  useEffect(() => {
    const loadModels = async () => {
      if (!filters.brand) {
        setModels([]);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch("/api/cars/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: filters.brand }),
        });
        if (response.ok) {
          const data = await response.json();
          setModels(data);
        }
      } catch (error) {
        console.error("Error al cargar modelos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, [filters.brand]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterParams>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      debouncedCallback(updatedFilters);
    },
    [filters, debouncedCallback]
  );

  const handlePriceChange = () => {
    handleFilterChange({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setFilters({});
    setMinPrice("");
    setMaxPrice("");
    debouncedCallback({});
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <Separator className="mb-6" />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={filters.status}
            onValueChange={(value: CarStatus) =>
              handleFilterChange({ status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CarStatus.NEW}>Nuevo</SelectItem>
              <SelectItem value={CarStatus.USED}>Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marca */}
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => handleFilterChange({ brand: value })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select
            value={filters.model}
            onValueChange={(value) => handleFilterChange({ model: value })}
            disabled={!filters.brand || loading}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={filters.brand ? "Todos los modelos" : "Selecciona una marca"} 
              />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmisión */}
        <div className="space-y-2">
          <Label>Transmisión</Label>
          <Select
            value={filters.transmission}
            onValueChange={(value) => handleFilterChange({ transmission: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de Precio */}
        <div className="space-y-2">
          <Label>Rango de Precio (USD)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceChange}
              placeholder="Precio mín"
              min={0}
            />
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceChange}
              placeholder="Precio máx"
              min={0}
            />
          </div>
        </div>

        <Separator />

        {/* Botón de reset */}
        <button
          onClick={handleReset}
          className="w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </Card>
  );
}
