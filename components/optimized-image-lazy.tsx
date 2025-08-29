"use client";

import { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);

  // Check if src is valid
  const isValidSrc = src && src.trim() !== '' && src !== placeholder;

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageError(true);
    onError?.();
  };

  return (
    <div className={cn("relative", className)}>
      {!imageError && isValidSrc && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes || (fill ? "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" : undefined)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn(fill && "object-cover")}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {(imageError || !isValidSrc) && (
        <Image
          src={placeholder}
          alt={`${alt} (placeholder)`}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes || (fill ? "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" : undefined)}
          loading="lazy"
          className={cn(fill && "object-cover")}
        />
      )}
    </div>
  );
}