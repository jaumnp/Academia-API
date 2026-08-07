import type { FastifyInstance } from "fastify";
import { GymsController } from "../controllers/gyms.controller.ts";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms.repository.ts";
import { GymsService } from "../services/gyms.service.ts";

export async function gymsRoutes(app: FastifyInstance) {
  const repository = new PrismaGymsRepository();
  const service = new GymsService(repository);
  const controller = new GymsController(service);

  app.get("/gym/:id", controller.index);
  app.get("/gym", controller.index);
  app.get("/gym/nearby", controller.findByDistance);
  app.post("/gym", controller.create);
  app.put("/gym", controller.update);
  app.delete("/gym", controller.delete);
}