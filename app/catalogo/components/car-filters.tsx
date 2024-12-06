"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    Promise.all([
      fetch('/api/cars/brands').then(res => res.json()),
      fetch('/api/cars/types').then(res => res.json())
    ]).then(([brandsData, typesData]) => {
      setBrands(brandsData);
      setTypes(typesData);
    });
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
      brand: selectedBrand === 'all' ? undefined : selectedBrand,
      model: selectedModel === 'all' ? undefined : selectedModel,
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === null ? undefined : selectedStatus,
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
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Marca y Modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Select 
              value={selectedBrand || undefined} 
              onValueChange={setSelectedBrand}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Select 
              value={selectedModel || undefined} 
              onValueChange={setSelectedModel} 
              disabled={!selectedBrand}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={"Todos"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {models.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tipo y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select 
              value={selectedType || undefined} 
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select 
              value={selectedStatus || undefined} 
              onValueChange={(value) => setSelectedStatus(value as CarStatus)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={CarStatus.NEW}>Nuevo</SelectItem>
                <SelectItem value={CarStatus.USED}>Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Rango de Precio */}
        <div>
          <Label>Rango de Precio (USD)</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Input
              type="number"
              placeholder="Mínimo"
              className="bg-white"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máximo"
              className="bg-white"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button onClick={handleFilter} className="flex-1">
          Aplicar
        </Button>
        <Button variant="outline" onClick={clearFilters} className="flex gap-2 flex-1 sm:flex-none sm:w-auto">
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden md:block md:max-w-sm md:mx-auto">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <FilterForm />
        </Card>
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
          <SheetContent side="bottom" className="h-[85vh] overflow-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Ajusta los filtros para encontrar el vehículo que buscas
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 px-4">
              <FilterForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
