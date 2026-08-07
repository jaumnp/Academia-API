import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CheckInsService } from "../services/check-ins.service.ts";

export class CheckInsController {
  constructor(private checkInsService: CheckInsService) {}

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        checkIn_id: z
          .uuid({ error: "O ID do check-in precisa ser válido!" })
          .optional(),
        page: z
          .string({ error: "O numero da pagina precisa ser válida!" })
          .optional(),
        qntd: z
          .string({ error: "O numero de quantidade precisa ser válido!" })
          .optional(),
      });

      const { checkIn_id, page, qntd } = validateQuery.parse(request.query);
      const data = await this.checkInsService.index({
        id: checkIn_id,
        page: Number(page),
        qntd: Number(qntd),
      });

      return reply.status(200).send({ data });
    } catch (error) {
      return reply
        .status(401)
        .send({ message: "Algo deu errado, tente mais tarde!" });
    }
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        user_id: z.uuid({ error: "O id do usuario é obrigatório!" }),
        gym_id: z.uuid({ error: "O id da academia é obrigatória!" }),
        latitude: z.coerce.number({ error: "Latitude inválida!" }),
        longitude: z.coerce.number({ error: "Longitude inválida!" }),
      });

      const { user_id, gym_id, latitude, longitude } = validateBody.parse(
        request.body,
      );

      const checkIn = await this.checkInsService.create({
        userId: user_id,
        gymId: gym_id,
        userLatitude: latitude,
        userLongitude: longitude,
      });

      return reply
        .status(201)
        .send({ message: "Check-In criado com sucesso!", checkIn });
    } catch (error) {
      return reply.status(401).send({
        message:
          error instanceof Error
            ? error.message
            : "Algo deu errado, tente mais tarde!",
      });
    }
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        id: z.uuid({ error: "O id do check-in é obrigatório!" }),
      });

      const { id } = validateQuery.parse(request.query);

      await this.checkInsService.delete({ checkIn_id: id });

      return reply
        .status(200)
        .send({ message: "Check-In deletado com sucesso!" });
    } catch (error) {
      return reply
        .status(401)
        .send({ message: "Não foi possivel deletar um check-in!" });
    }
  };
}
