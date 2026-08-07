import type { FastifyInstance } from "fastify";
import { CheckInsController } from "../controllers/check-ins.controller.ts";
import { PrismaCheckInsRepository } from "../repositories/prisma/prisma-check-ins.repository.ts";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms.repository.ts";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users.repository.ts";
import { CheckInsService } from "../services/check-ins.service.ts";

export async function checkInsRoutes(app: FastifyInstance) {
  // O CheckIn precisa validar regras de academias e usuários, por isso injetamos todos
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const usersRepository = new PrismaUsersRepository(); // Lembre-se de adicionar o método findById no UsersRepository e na implementação Prisma

  const service = new CheckInsService(checkInsRepository, gymsRepository, usersRepository);
  const controller = new CheckInsController(service);

  app.get("/checkin/:id", controller.index);
  app.get("/checkin", controller.index);
  app.post("/checkin", controller.create);
  app.delete("/checkin", controller.delete);
}