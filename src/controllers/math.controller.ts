import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MathService } from "@/services/math.service.ts";

export class MathController {
  constructor(private mathService: MathService) {}

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        n1: z.string().min(1, "O primeiro parametro deve ser valido!"),
        n2: z.string().min(1, "O segundo parametro deve ser valido!"),
      });

      const { n1, n2 } = validateQuery.parse(request.query);
      const sum = this.mathService.calcSum({ n1, n2 });
      return reply.status(200).send({ sum });
    } catch (error) {
      console.log(error);
      return reply.status(400).send({ message: "Algo deu errado!" });
    }
  };
}
