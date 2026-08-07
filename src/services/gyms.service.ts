import type { GymsRepository } from "../repositories/gyms.repository.ts";
import { Prisma } from "../../generated/prisma/client.ts";

interface SearchQuery {
  id?: string | undefined;
  page?: number | undefined;
  qntd?: number | undefined;
}

export class GymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async index({ id, page, qntd }: SearchQuery) {
    return await this.gymsRepository.findMany(id, page, qntd);
  }

  async findByDistance({
    latitude,
    longitude,
    distanceInKm,
  }: {
    latitude: number;
    longitude: number;
    distanceInKm: number;
  }) {
    return await this.gymsRepository.findManyNearby({
      latitude,
      longitude,
      distanceInKm,
    });
  }

  async create({ data }: { data: Prisma.GymCreateInput }) {
    // Para academias, geralmente a criação é direta,
    // mas se você quisesse impedir duas academias com o mesmo nome, a validação entraria aqui!
    return await this.gymsRepository.create(data);
  }

  async update({
    data,
    gym_id,
  }: {
    data: Prisma.GymUpdateInput;
    gym_id: string;
  }) {
    const gymExists = await this.gymsRepository.findById(gym_id);

    if (!gymExists) {
      throw new Error("Academia não encontrada!");
    }

    return await this.gymsRepository.update(gym_id, data);
  }

  async delete({ gym_id }: { gym_id: string }) {
    const gymExists = await this.gymsRepository.findById(gym_id);

    if (!gymExists) {
      throw new Error("Academia não encontrada!");
    }

    return await this.gymsRepository.delete(gym_id);
  }
}
