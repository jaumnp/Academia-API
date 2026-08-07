import type { Prisma, Gym } from "../../generated/prisma/client.ts";

export interface FindByDistanceParams {
  latitude: number;
  longitude: number;
  distanceInKm: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findMany(id?: string, page?: number, qntd?: number): Promise<Gym[]>;
  findManyNearby(params: FindByDistanceParams): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  update(id: string, data: Prisma.GymUpdateInput): Promise<Gym>;
  delete(id: string): Promise<Gym>;
}