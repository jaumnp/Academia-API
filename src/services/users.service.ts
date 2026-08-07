import type { UsersRepository } from "../repositories/users.repository.ts";
import { Prisma } from "../../generated/prisma/client.ts";

interface SearchQuery {
  name?: string | undefined;
  page?: number | undefined;
  qntd?: number | undefined;
}

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async index({ name, page, qntd }: SearchQuery) {
    return await this.usersRepository.findManyByName(name, page, qntd);
  }

  async create({ data }: { data: Prisma.UserCreateInput }) {
    const userExists = await this.usersRepository.findByEmail(data.email);
    if (userExists) throw new Error("Usuário já registrado!");

    return await this.usersRepository.create(data);
  }

  async delete({ id }: { id: string }) {
    return await this.usersRepository.delete(id);
  }
}
