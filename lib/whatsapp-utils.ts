const WHATSAPP_NUMBER = '+5492915725975';

export interface SellCarFormData {
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  year: string;
  condition: string;
  mileage: string;
  price: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Detecta si el usuario está en un dispositivo móvil
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Construye el mensaje para el formulario de venta de auto
 */
export function buildSellCarWhatsAppMessage(formData: SellCarFormData): string {
  const message = `¡Hola! Me interesa vender mi auto.

Nombre: ${formData.name}
Teléfono: ${formData.phone}
Email: ${formData.email}
Marca: ${formData.brand}
Modelo: ${formData.model}
Año: ${formData.year}
Condición: ${formData.condition}
Kilometraje: ${formData.mileage} km
Precio: $${formData.price}
Mensaje adicional: ${formData.description}`;

  return message;
}

/**
 * Construye el mensaje para el formulario de contacto general
 */
export function buildContactWhatsAppMessage(formData: ContactFormData): string {
  const message = `¡Hola! Tengo una consulta.

Nombre: ${formData.name}
Email: ${formData.email}
Mensaje: ${formData.message}`;

  return message;
}

/**
 * Construye el mensaje para el formulario de interés en un auto específico
 */
export function buildInterestWhatsAppMessage(formData: ContactFormData, carInfo?: string): string {
  const carMessage = carInfo ? `\n\nAuto consultado: ${carInfo}` : '';
  
  const message = `¡Hola! Estoy interesado en un auto.

Nombre: ${formData.name}
Email: ${formData.email}
Mensaje: ${formData.message}${carMessage}`;

  return message;
}

/**
 * Crea la URL de WhatsApp con el mensaje codificado
 */
export function createWhatsAppURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  
  // Si es móvil, usar esquema nativo, sino WhatsApp Web
  if (isMobile()) {
    return `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`;
  }
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Abre WhatsApp con el mensaje especificado
 */
export function openWhatsApp(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const url = createWhatsAppURL(message);
      
      // Abrir en nueva ventana/pestaña
      const newWindow = window.open(url, '_blank');
      
      // Verificar si se pudo abrir la ventana
      if (!newWindow) {
        // Si no se puede abrir, intentar con location.href como fallback
        window.location.href = url;
      }
      
      resolve();
    } catch (error) {
      reject(new Error('No se pudo abrir WhatsApp. Por favor, intenta nuevamente.'));
    }
  });
} 