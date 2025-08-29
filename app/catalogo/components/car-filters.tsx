"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Slider } from "@/components/ui/slider";
import { useCarOptions } from "@/hooks/use-car-options";

interface CarFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

/** Componente reutilizable para controles de rango */
interface RangeSliderControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  sliderValue: number[];
  inputValues: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleSliderChange: (value: number[]) => void;
  validateAndUpdateValue: (value: string, index: number) => void;
  tooltipContent: (value: number) => string;
}

function RangeSliderControl({
  label,
  min,
  max,
  step,
  sliderValue,
  inputValues,
  handleInputChange,
  handleSliderChange,
  validateAndUpdateValue,
  tooltipContent,
}: RangeSliderControlProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="pt-2">
        <Slider
          value={sliderValue}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="py-4"
          showTooltip
          tooltipContent={tooltipContent}
        />
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="text"
              value={inputValues[0]}
              onChange={(e) => handleInputChange(e, 0)}
              onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
              className="w-24 bg-white"
            />
            <span className="text-muted-foreground">a</span>
            <Input
              type="text"
              value={inputValues[1]}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
              className="w-24 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarFilters({ onFilterChange }: CarFiltersProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CarStatus | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [selectedSoldStatus, setSelectedSoldStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar opciones dinámicas
  const { options: transmissionOptions } = useCarOptions('TRANSMISSION');
  const { options: typeOptions } = useCarOptions('TYPE');
  const { options: fuelTypeOptions } = useCarOptions('FUEL_TYPE');

  const {
    sliderValue: priceSliderValue,
    inputValues: priceInputValues,
    validateAndUpdateValue: validateAndUpdatePriceValue,
    handleInputChange: handlePriceInputChange,
    handleSliderChange: handlePriceSliderChange,
    resetToDefault: resetPriceToDefault,
  } = useSliderWithInput({
    minValue: 0,
    maxValue: 100000,
    initialValue: [0, 100000],
    defaultValue: [0, 100000],
  });

  const {
    sliderValue: mileageSliderValue,
    inputValues: mileageInputValues,
    validateAndUpdateValue: validateAndUpdateMileageValue,
    handleInputChange: handleMileageInputChange,
    handleSliderChange: handleMileageSliderChange,
    resetToDefault: resetMileageToDefault,
  } = useSliderWithInput({
    minValue: 0,
    maxValue: 300000,
    initialValue: [0, 300000],
    defaultValue: [0, 300000],
  });

  const currentYear = new Date().getFullYear();
  const {
    sliderValue: yearSliderValue,
    inputValues: yearInputValues,
    validateAndUpdateValue: validateAndUpdateYearValue,
    handleInputChange: handleYearInputChange,
    handleSliderChange: handleYearSliderChange,
    resetToDefault: resetYearToDefault,
  } = useSliderWithInput({
    minValue: currentYear - 20,
    maxValue: currentYear,
    initialValue: [currentYear - 20, currentYear],
    defaultValue: [currentYear - 20, currentYear],
  });

  // Carga inicial de marcas y tipos
  useEffect(() => {
    Promise.all([
      fetch("/api/cars/brands").then((res) => res.json()),
      fetch("/api/cars/types").then((res) => res.json()),
    ])
      .then(([brandsData, typesData]) => {
        setBrands(brandsData);
        setTypes(typesData);
      })
      .catch((error) => console.error("Error al cargar marcas o tipos:", error));
  }, []);

  // Actualiza modelos al seleccionar una marca
  useEffect(() => {
    if (selectedBrand && selectedBrand !== "all") {
      fetch("/api/cars/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: selectedBrand }),
      })
        .then((res) => res.json())
        .then(setModels)
        .catch((error) => console.error("Error al cargar modelos:", error));
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedBrand]);

  const handleFilter = useCallback(() => {
    const filters = {
      brand: !selectedBrand || selectedBrand === "all" ? undefined : selectedBrand,
      model: !selectedModel || selectedModel === "all" ? undefined : selectedModel,
      type: !selectedType || selectedType === "all" ? undefined : selectedType,
      status: selectedStatus ?? undefined,
      transmission:
        !selectedTransmission || selectedTransmission === "all"
          ? undefined
          : selectedTransmission,
      fuelType:
        !selectedFuelType || selectedFuelType === "all" ? undefined : selectedFuelType,
      vendido:
        !selectedSoldStatus || selectedSoldStatus === "all"
          ? undefined
          : selectedSoldStatus === "sold",
      minPrice: priceSliderValue[0],
      maxPrice: priceSliderValue[1],
      minMileage: mileageSliderValue[0],
      maxMileage: mileageSliderValue[1],
      minYear: yearSliderValue[0],
      maxYear: yearSliderValue[1],
    };
    onFilterChange(filters);
    setIsOpen(false);
  }, [
    selectedBrand,
    selectedModel,
    selectedType,
    selectedStatus,
    selectedTransmission,
    selectedFuelType,
    selectedSoldStatus,
    priceSliderValue,
    mileageSliderValue,
    yearSliderValue,
    onFilterChange,
  ]);

  const clearFilters = useCallback(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedTransmission(null);
    setSelectedFuelType(null);
    setSelectedSoldStatus(null);
    resetPriceToDefault();
    resetMileageToDefault();
    resetYearToDefault();
    onFilterChange({});
    setIsOpen(false);
  }, [
    resetPriceToDefault,
    resetMileageToDefault,
    resetYearToDefault,
    onFilterChange,
  ]);

  // Formulario de filtros (se reutiliza en Desktop y Mobile)
  const FilterForm = useMemo(
    () => (
      <div className="space-y-4">
        {/* Marca y Modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Select value={selectedBrand || undefined} onValueChange={setSelectedBrand}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Select
              value={selectedModel || undefined}
              onValueChange={setSelectedModel}
              disabled={!selectedBrand || selectedBrand === "all"}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
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
            <Select value={selectedType || undefined} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {typeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.value}
                  </SelectItem>
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

        {/* Transmisión y Combustible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmisión</Label>
            <Select
              value={selectedTransmission || undefined}
              onValueChange={setSelectedTransmission}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {transmissionOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelType">Combustible</Label>
            <Select value={selectedFuelType || undefined} onValueChange={setSelectedFuelType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {fuelTypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Estado de Venta */}
        <div className="space-y-2">
          <Label htmlFor="soldStatus">Estado de Venta</Label>
          <Select value={selectedSoldStatus || undefined} onValueChange={setSelectedSoldStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        {/* Rango de Precio */}
        <RangeSliderControl
          label="Rango de Precio (USD)"
          min={0}
          max={100000}
          step={100}
          sliderValue={priceSliderValue}
          inputValues={priceInputValues}
          handleInputChange={handlePriceInputChange}
          handleSliderChange={handlePriceSliderChange}
          validateAndUpdateValue={validateAndUpdatePriceValue}
          tooltipContent={(value) => `USD ${value.toLocaleString()}`}
        />

        <Separator className="my-4" />

        {/* Rango de Kilometraje */}
        <RangeSliderControl
          label="Kilometraje"
          min={0}
          max={300000}
          step={1000}
          sliderValue={mileageSliderValue}
          inputValues={mileageInputValues}
          handleInputChange={handleMileageInputChange}
          handleSliderChange={handleMileageSliderChange}
          validateAndUpdateValue={validateAndUpdateMileageValue}
          tooltipContent={(value) => `${value.toLocaleString()} km`}
        />

        <Separator className="my-4" />

        {/* Rango de Año */}
        <RangeSliderControl
          label="Año"
          min={currentYear - 20}
          max={currentYear}
          step={1}
          sliderValue={yearSliderValue}
          inputValues={yearInputValues}
          handleInputChange={handleYearInputChange}
          handleSliderChange={handleYearSliderChange}
          validateAndUpdateValue={validateAndUpdateYearValue}
          tooltipContent={(value) => value.toString()}
        />

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={handleFilter} className="flex-1">
            Aplicar
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex gap-2 flex-1 sm:flex-none sm:w-auto"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>
    ),
    [
      brands,
      typeOptions,
      transmissionOptions,
      fuelTypeOptions,
      models,
      selectedBrand,
      selectedModel,
      selectedType,
      selectedStatus,
      selectedTransmission,
      selectedFuelType,
      selectedSoldStatus,
      priceSliderValue,
      priceInputValues,
      handlePriceInputChange,
      handlePriceSliderChange,
      validateAndUpdatePriceValue,
      mileageSliderValue,
      mileageInputValues,
      handleMileageInputChange,
      handleMileageSliderChange,
      validateAndUpdateMileageValue,
      yearSliderValue,
      yearInputValues,
      handleYearInputChange,
      handleYearSliderChange,
      validateAndUpdateYearValue,
      currentYear,
      handleFilter,
      clearFilters,
    ]
  );

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden lg:block">
        <Card className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
          {FilterForm}
        </Card>
      </div>

      {/* Versión Mobile y Tablet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex gap-2 text-sm sm:text-base py-2 sm:py-3">
              <Filter className="h-4 w-4" />
              Filtrar Vehículos
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] max-h-[600px] overflow-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-lg sm:text-xl">Filtros</SheetTitle>
              <SheetDescription className="text-sm sm:text-base">
                Ajusta los filtros para encontrar el vehículo que buscas
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 sm:mt-6 px-2 sm:px-4">{FilterForm}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
