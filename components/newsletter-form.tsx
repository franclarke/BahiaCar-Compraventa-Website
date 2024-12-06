"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Error al suscribirse");

      toast({
        title: "¡Éxito!",
        description: "Te has suscrito correctamente a nuestro boletín.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la suscripción. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Suscríbete para recibir novedades sobre nuevos vehículos en venta y ofertas
        especiales.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          required
          className="flex-1"
        />
        <Button type="submit">
          <Mail className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
