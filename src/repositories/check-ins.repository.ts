import type { Prisma, CheckIn } from "../../generated/prisma/client.ts";

export interface CheckInsRepository {
  findMany(id?: string, page?: number, qntd?: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  delete(id: string): Promise<CheckIn>;
}