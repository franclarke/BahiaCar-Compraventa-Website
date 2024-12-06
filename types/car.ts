import { CarStatus } from "@prisma/client";

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  status: CarStatus;
  mileage: number;
  price: number;
  transmission: string;
  type: string;
  fuelType: string;
  images: string[];
  description: string;
  createdAt: Date;
}

export interface FilterParams {
  brand?: string;
  model?: string;
  type?: string;
  status?: CarStatus;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
}
