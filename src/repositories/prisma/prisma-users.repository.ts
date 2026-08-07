import type { Prisma, User } from "../../../generated/prisma/client.ts";
import type { UsersRepository } from "../users.repository.ts";
import { prisma } from "../../lib/prisma.ts";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
  
  async findManyByName(name?: string, page?: number, qntd?: number) {
    return await prisma.user.findMany({
      where: name ? { name: { contains: name.trim() } } : {},
      ...(qntd ? { take: Number(qntd) } : {}),
      ...(page && qntd ? { skip: (Number(page) - 1) * Number(qntd) } : {}),
      include: { checkIns: true },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({ data, where: { id } });
  }

  async delete(id: string) {
    return await prisma.user.delete({ where: { id } });
  }
}