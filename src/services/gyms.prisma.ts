import { getDistanceBetweenCoordinates } from "@/utils/get-distance-beetwen-coordinates.ts";
import { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

export class GymsPrismaServices {
  async index({
    id,
    page,
    qntd,
  }: {
    id?: string;
    page?: number | string;
    qntd?: number | string;
  }) {
    const data = await prisma.gym.findMany({
      where: id ? { id } : {},

      ...(qntd ? { take: Number(qntd) } : {}),
      ...(page && qntd ? { skip: (Number(page) - 1) * Number(qntd) } : {}),

      include: {
        checkIns: true,
      },
    });

    return data;
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
    const data = await prisma.gym.findMany();

    const gyms = data.filter((gym) => {
      const dist = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
      );

      return dist <= distanceInKm;
    });

    return gyms;
  }

  async create({ data }: { data: Prisma.GymCreateInput }) {
    const created = await prisma.gym.create({ data });

    return created;
  }

  async update({
    data,
    gym_id,
  }: {
    data: Prisma.GymUpdateInput;
    gym_id: string;
  }) {
    const updated = await prisma.gym.update({ data, where: { id: gym_id } });

    return updated;
  }

  async delete({ gym_id }: { gym_id: string }) {
    const data = await prisma.gym.delete({ where: { id: gym_id } });

    return data;
  }
}
