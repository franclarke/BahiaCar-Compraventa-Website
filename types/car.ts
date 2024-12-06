import { CarStatus } from "@prisma/client";

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: CarStatus;
  type: string;
  transmission: string;
  fuelType: string;
  description: string;
  images: string[];
}

export interface FilterParams {
  status?: CarStatus;
  type?: string;
  brand?: string;
  model?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
}
