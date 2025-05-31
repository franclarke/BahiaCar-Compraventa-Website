"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Loader2 } from "lucide-react";

interface ContactDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMessage?: string;
  triggerButton?: boolean;
}

export function ContactDialog({ 
  open, 
  onOpenChange, 
  defaultMessage = "", 
  triggerButton = true 
}: ContactDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, message: defaultMessage }));
  }, [defaultMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Mensaje enviado",
          description: "Nos pondremos en contacto contigo pronto.",
        });
        setFormData({ name: "", email: "", message: "" });
        if (onOpenChange) onOpenChange(false);
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full min-h-[44px]"
            aria-label="Abrir formulario de contacto"
          >
            <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Consultanos Ahora
          </Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="contact-form-description"
      >
        <DialogHeader>
          <DialogTitle>Contactanos</DialogTitle>
          <DialogDescription id="contact-form-description">
            Envíanos tu consulta y te responderemos a la brevedad.
          </DialogDescription>
        </DialogHeader>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          aria-label="Formulario de contacto"
        >
          <div className="space-y-2">
            <Label htmlFor="contact-name">Nombre</Label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              aria-describedby="name-help"
            />
            <span id="name-help" className="sr-only">
              Ingresa tu nombre completo
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              aria-describedby="email-help"
            />
            <span id="email-help" className="sr-only">
              Ingresa tu correo electrónico para que podamos responderte
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Mensaje</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Tu mensaje..."
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              required
              className="min-h-[100px]"
              aria-describedby="message-help"
            />
            <span id="message-help" className="sr-only">
              Describe tu consulta o lo que necesites
            </span>
          </div>
          <Button 
            type="submit" 
            className="w-full min-h-[44px]" 
            disabled={loading}
            aria-label={loading ? "Enviando mensaje" : "Enviar mensaje de contacto"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              "Enviar mensaje"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
