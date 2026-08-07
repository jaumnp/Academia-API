import { MathService } from "@/services/math.service.ts";
import { MathTests } from "@/repositories/tests/math.tests.ts";
import type { FastifyInstance } from "fastify";
import { MathController } from "@/controllers/math.controller.ts";

export async function mathRoutes(app: FastifyInstance) {
  const repository = new MathTests();
  const services = new MathService(repository);
  const controller = new MathController(services);

  app.get("/sum", controller.index);
}
