import type { FastifyInstance } from "fastify";
import { UsersController } from "../controllers/users.controller.ts";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users.repository.ts";
import { UsersService } from "../services/users.service.ts";

export async function usersRoutes(app: FastifyInstance) {
  const repository = new PrismaUsersRepository();
  const service = new UsersService(repository);
  const controller = new UsersController(service);

  app.get("/users", controller.index);
  app.post("/users", controller.create);
  app.delete("/users", controller.delete);
}