import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hash } from "bcrypt";
import { UsersService } from "../services/users.service.ts";

export class UsersController {
  constructor(private usersService: UsersService) {}

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateQuery = z.object({
        name: z
          .uuid({ error: "O nome do usuario precisa ser válido!" })
          .optional(),
        page: z
          .string({ error: "O numero da pagina precisa ser válida!" })
          .optional(),
        qntd: z
          .string({ error: "O numero de quantidade precisa ser válido!" })
          .optional(),
      });

      const { name, page, qntd } = validateQuery.parse(request.query);
      const data = await this.usersService.index({
        name,
        page: Number(page),
        qntd: Number(qntd),
      });
      return reply.status(200).send({ data });
    } catch (error) {
      return reply
        .status(400)
        .send({ message: "Algo deu errado, tente mais tarde!" });
    }
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        name: z.string().min(1, "O nome é obrigatório!"),
        email: z.email("Formato de e-mail inválido!"),
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres!"),
      });

      const { name, email, password } = validateBody.parse(request.body);
      const passwordHashed = await hash(password, 10);

      await this.usersService.create({
        data: { name, email, password: passwordHashed },
      });

      return reply.status(201).send({ message: "Usuario criado com sucesso!" });
    } catch (error) {
      return reply.status(401).send({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possivel criar usuario!",
      });
    }
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validateBody = z.object({
        id: z.string().uuid("O id do usuario é obrigatório!"),
      });
      const { id } = validateBody.parse(request.body);

      await this.usersService.delete({ id });
      return reply
        .status(200)
        .send({ message: "Usuario deletado com sucesso!" });
    } catch (error) {
      return reply
        .status(401)
        .send({ message: "Não foi possivel deletar o usuario!" });
    }
  };
}
