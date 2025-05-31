import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row pt-14 sm:pt-16 lg:pt-0">
      {/* Sección Izquierda - Loading */}
      <section 
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0 order-2 lg:order-1"
        aria-label="Cargando contenido principal"
      >
        <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6 sm:space-y-8">
          {/* Título skeleton */}
          <div className="text-center lg:text-left space-y-3 sm:space-y-4">
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-full" />
            <Skeleton className="h-6 sm:h-8 w-4/5 mx-auto lg:mx-0" />
          </div>

          {/* Botones skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-12 sm:h-16 w-full" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Skeleton className="h-12 sm:h-16 w-full" />
              <Skeleton className="h-12 sm:h-16 w-full" />
            </div>
          </div>

          {/* Newsletter skeleton */}
          <div className="pt-4 sm:pt-6 border-t space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Derecha - Imagen skeleton */}
      <section 
        className="w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-screen relative order-1 lg:order-2"
        aria-label="Cargando imagen destacada"
      >
        <Skeleton className="w-full h-full" />
      </section>
    </main>
  );
} 