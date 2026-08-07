import type { Prisma, User } from "../../generated/prisma/client.ts";

export interface UsersRepository {
  findManyByName(name?: string, page?: number, qntd?: number): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>; // <-- Adicionado aqui!
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: string): Promise<User>;
}