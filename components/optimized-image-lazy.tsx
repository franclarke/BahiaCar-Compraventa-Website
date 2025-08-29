"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageLazyProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImageLazy({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  placeholder = "/placeholder-car.jpg",
  onLoad,
  onError,
}: OptimizedImageLazyProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading if priority is true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={cn("relative", className)}>
      {isVisible && (
        <>
          {!imageError && (
            <Image
              src={imageError ? placeholder : src}
              alt={alt}
              fill={fill}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              sizes={sizes}
              priority={priority}
              className={cn(
                "transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                fill && "object-cover"
              )}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
          {imageError && (
            <Image
              src={placeholder}
              alt={alt}
              fill={fill}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              sizes={sizes}
              className={cn(
                "opacity-100",
                fill && "object-cover"
              )}
            />
          )}
          {!imageLoaded && !imageError && (
            <div className={cn(
              "animate-pulse bg-gray-200",
              fill && "absolute inset-0"
            )} />
          )}
        </>
      )}
      
      {!isVisible && (
        <div className={cn(
          "animate-pulse bg-gray-200",
          fill && "absolute inset-0"
        )} />
      )}
    </div>
  );
}