"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";

interface CarFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function CarFilters({ onFilterChange }: CarFiltersProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CarStatus | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cargar marcas
    fetch('/api/cars/brands')
      .then(res => res.json())
      .then(setBrands);

    // Cargar tipos
    fetch('/api/cars/types')
      .then(res => res.json())
      .then(setTypes);
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetch('/api/cars/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: selectedBrand })
      })
        .then(res => res.json())
        .then(setModels);
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedBrand]);

  const handleFilter = () => {
    const filters = {
      brand: selectedBrand || undefined,
      model: selectedModel || undefined,
      type: selectedType || undefined,
      status: selectedStatus || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    onFilterChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({});
    setIsOpen(false);
  };

  const FilterForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marca */}
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select 
            value={selectedBrand || undefined} 
            onValueChange={setSelectedBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Select 
            value={selectedModel || undefined} 
            onValueChange={setSelectedModel} 
            disabled={!selectedBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los modelos</SelectItem>
              {models.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={selectedType || undefined} 
            onValueChange={setSelectedType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select 
            value={selectedStatus || undefined} 
            onValueChange={(value) => setSelectedStatus(value as CarStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value={CarStatus.NEW}>Nuevo</SelectItem>
              <SelectItem value={CarStatus.USED}>Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Precio Mínimo */}
        <div className="space-y-2">
          <Label htmlFor="minPrice">Precio Mínimo</Label>
          <Input
            type="number"
            id="minPrice"
            placeholder="Precio mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Precio Máximo */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Precio Máximo</Label>
          <Input
            type="number"
            id="maxPrice"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter} className="flex-1">Aplicar Filtros</Button>
        <Button variant="outline" onClick={clearFilters} className="flex gap-2">
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden md:block bg-white p-6 rounded-lg border">
        <FilterForm />
      </div>

      {/* Versión Mobile */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex gap-2">
              <Filter className="h-4 w-4" />
              Filtrar Vehículos
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Ajusta los filtros para encontrar el vehículo que buscas
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
