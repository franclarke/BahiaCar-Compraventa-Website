"use client";

import { useState } from "react";
import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export function SellCarDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    year: "",
    condition: "",
    mileage: "",
    price: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/sell_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al enviar");

      toast({
        title: "¡Éxito!",
        description: "Tu solicitud de venta se ha enviado correctamente. Pronto te contactaremos.",
      });
      setOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        brand: "",
        model: "",
        year: "",
        condition: "",
        mileage: "",
        price: "",
        description: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar tu auto. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="w-full min-h-[44px]"
          aria-label="Abrir formulario para vender tu vehículo"
        >
          <Car className="mr-2 h-5 w-5" aria-hidden="true" />
          Publicá Tu Auto Hoy
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        aria-describedby="sell-form-description"
      >
        <DialogHeader>
          <DialogTitle>Vender mi auto</DialogTitle>
          <p id="sell-form-description" className="text-sm text-muted-foreground mt-2">
            Completa este formulario para que podamos evaluar tu vehículo y contactarte con una oferta
          </p>
        </DialogHeader>
        <form 
          onSubmit={handleSubmit} 
          className="grid grid-cols-2 gap-4"
          aria-label="Formulario de venta de vehículo"
        >
          <div className="space-y-2">
            <Label htmlFor="sell-name">Nombre</Label>
            <Input
              id="sell-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              aria-describedby="name-sell-help"
            />
            <span id="name-sell-help" className="sr-only">
              Tu nombre completo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-phone">Teléfono</Label>
            <Input
              id="sell-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              required
              aria-describedby="phone-help"
            />
            <span id="phone-help" className="sr-only">
              Número de teléfono para contactarte
            </span>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="sell-email">Correo Electrónico</Label>
            <Input
              id="sell-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              aria-describedby="email-sell-help"
            />
            <span id="email-sell-help" className="sr-only">
              Correo electrónico para enviarte información
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-brand">Marca</Label>
            <Input
              id="sell-brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: Toyota, Ford, etc."
              aria-describedby="brand-help"
            />
            <span id="brand-help" className="sr-only">
              Marca del vehículo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-model">Modelo</Label>
            <Input
              id="sell-model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: Corolla, Focus, etc."
              aria-describedby="model-help"
            />
            <span id="model-help" className="sr-only">
              Modelo específico del vehículo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-year">Año</Label>
            <Input
              id="sell-year"
              name="year"
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: 2020"
              aria-describedby="year-help"
            />
            <span id="year-help" className="sr-only">
              Año de fabricación del vehículo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-condition">Condición</Label>
            <Input
              id="sell-condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Nuevo, Usado, etc."
              aria-describedby="condition-help"
            />
            <span id="condition-help" className="sr-only">
              Estado general del vehículo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-mileage">Kilometraje</Label>
            <Input
              id="sell-mileage"
              name="mileage"
              type="number"
              min="0"
              value={formData.mileage}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: 50000"
              aria-describedby="mileage-help"
            />
            <span id="mileage-help" className="sr-only">
              Kilómetros recorridos por el vehículo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell-price">Precio esperado</Label>
            <Input
              id="sell-price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: 5000000"
              aria-describedby="price-help"
            />
            <span id="price-help" className="sr-only">
              Precio que esperas por tu vehículo
            </span>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="sell-description">Mensaje adicional</Label>
            <Textarea
              id="sell-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className="min-h-[100px]"
              required
              placeholder="Cuéntanos más detalles sobre tu vehículo..."
              aria-describedby="description-help"
            />
            <span id="description-help" className="sr-only">
              Información adicional sobre el vehículo, estado, mantenimiento, etc.
            </span>
          </div>
          <Button 
            type="submit" 
            className="col-span-2 min-h-[44px]"
            disabled={loading}
            aria-label={loading ? "Enviando solicitud de venta" : "Enviar solicitud de venta"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              "Publicar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
