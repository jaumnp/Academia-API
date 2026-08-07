import type { Prisma, Gym } from "../../../generated/prisma/client.ts";
import type { FindByDistanceParams, GymsRepository } from "../gyms.repository.ts";
import { prisma } from "../../lib/prisma.ts";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    return await prisma.gym.findUnique({ where: { id } });
  }

  async findMany(id?: string, page?: number, qntd?: number) {
    return await prisma.gym.findMany({
      where: id ? { id } : {},
      ...(qntd ? { take: Number(qntd) } : {}),
      ...(page && qntd ? { skip: (Number(page) - 1) * Number(qntd) } : {}),
      include: { checkIns: true },
    });
  }

  async findManyNearby({ latitude, longitude, distanceInKm }: FindByDistanceParams) {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${distanceInKm}
    `;
  }

  async create(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({ data });
  }

  async update(id: string, data: Prisma.GymUpdateInput) {
    return await prisma.gym.update({ data, where: { id } });
  }

  async delete(id: string) {
    return await prisma.gym.delete({ where: { id } });
  }
}