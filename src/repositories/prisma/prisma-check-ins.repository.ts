import type { Prisma, CheckIn } from "../../../generated/prisma/client.ts";
import type { CheckInsRepository } from "../check-ins.repository.ts";
import { prisma } from "../../lib/prisma.ts";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findMany(id?: string, page?: number, qntd?: number) {
    return await prisma.checkIn.findMany({
      where: id ? { id } : {},
      ...(qntd ? { take: Number(qntd) } : {}),
      ...(page && qntd ? { skip: (Number(page) - 1) * Number(qntd) } : {}),
      include: { gym: true, user: true },
    });
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date").toDate();
    const endOfTheDay = dayjs(date).endOf("date").toDate();

    return await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: { gte: startOfTheDay, lte: endOfTheDay },
      },
    });
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({ data });
  }

  async delete(id: string) {
    return await prisma.checkIn.delete({ where: { id } });
  }
}