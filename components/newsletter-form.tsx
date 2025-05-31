"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        ¡No te pierdas las mejores ofertas! Suscribite y recibí novedades sobre autos y promociones exclusivas.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico para newsletter
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            required
            disabled={isLoading}
            aria-describedby="newsletter-description"
            className="flex-1"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !email.trim()}
          aria-label="Suscribirse al boletín de noticias"
          className="min-w-[44px] min-h-[44px] px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isLoading ? "Suscribiendo..." : "Suscribirse"}
          </span>
        </Button>
      </form>
      <p id="newsletter-description" className="sr-only">
        Formulario para suscribirse al boletín de noticias y recibir ofertas de automóviles
      </p>
    </div>
  );
}
