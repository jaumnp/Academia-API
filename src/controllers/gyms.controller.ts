import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GymsService } from "../services/gyms.service.ts";

export class GymsController {
  constructor(private gymsService: GymsService) {}

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        id: z
          .uuid({ error: "O ID da academia precisa ser válida!" })
          .optional(),
        page: z
          .string({ error: "O numero da pagina precisa ser válida!" })
          .optional(),
        qntd: z
          .string({ error: "O numero de quantidade precisa ser válido!" })
          .optional(),
      });

      const { id, page, qntd } = validateQuery.parse(request.query);
      const data = await this.gymsService.index({
        id,
        page: Number(page),
        qntd: Number(qntd),
      });
      return reply.status(200).send({ data });
    } catch (error) {
      return reply.status(400).send({ message: "Algo deu errado!" });
    }
  };

  findByDistance = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        latitude: z.coerce.number({ error: "Latitude inválida!" }),
        longitude: z.coerce.number({ error: "Longitude inválida!" }),
        distanceInKm: z.number({ error: "Distancia inválida!" }),
      });

      const { latitude, longitude, distanceInKm } = validateQuery.parse(
        request.query,
      );
      const data = await this.gymsService.findByDistance({
        latitude: Number(latitude),
        longitude: Number(longitude),
        distanceInKm: Number(distanceInKm),
      });
      return reply.status(200).send({ data });
    } catch (error) {
      return reply.status(400).send({ message: "Algo deu errado!" });
    }
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        title: z.string().min(1, "O nome é obrigatório!"),
        description: z
          .string()
          .min(10, "Descricao inválida! Deve ter no minimo 10 caracteres."),
        phone: z
          .string()
          .min(
            12,
            "Numero de celular inválido! Deve ter no minimo 12 numeros.",
          ),
        latitude: z.coerce.number({ error: "Latitude inválida!" }),
        longitude: z.coerce.number({ error: "Longitude inválida!" }),
      });

      const { title, description, phone, latitude, longitude } =
        validateBody.parse(request.body);

      await this.gymsService.create({
        data: {
          title,
          description,
          phone,
          latitude: String(latitude),
          longitude: String(longitude),
        },
      });

      return reply
        .status(201)
        .send({ message: "Academia cadastrada com sucesso!" });
    } catch (error) {
      return reply.status(401).send({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possivel cadastrar a academia!",
      });
    }
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        title: z.string().min(1, "O nome é obrigatório!"),
        description: z
          .string()
          .min(10, "Descricao inválida! Deve ter no minimo 10 caracteres."),
        phone: z
          .string()
          .min(
            12,
            "Numero de celular inválido! Deve ter no minimo 12 numeros.",
          ),
        gym_id: z.string().uuid("O id da academia é obrigatório!"),
      });

      const { gym_id, title, description, phone } = validateBody.parse(
        request.body,
      );

      await this.gymsService.update({
        data: { title, description, phone },
        gym_id,
      });

      return reply
        .status(200)
        .send({ message: "Academia atualizada com sucesso!" });
    } catch (error) {
      return reply
        .status(401)
        .send({ message: "Não foi possivel atualizar a academia!" });
    }
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        gym_id: z.string().uuid("O id da academia é obrigatório!"),
      });
      const { gym_id } = validateBody.parse(request.body);

      await this.gymsService.delete({ gym_id });
      return reply
        .status(200)
        .send({ message: "Academia deletada com sucesso!" });
    } catch (error) {
      return reply
        .status(401)
        .send({ message: "Não foi possivel deletar a academia!" });
    }
  };
}
