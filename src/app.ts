import fastify from "fastify";
import { usersRoutes } from "./routes/users.route.ts";
import { checkInsRoutes } from "./routes/check-ins.route.ts";
import { gymsRoutes } from "./routes/gyms.route.ts";
import { mathRoutes } from "./routes/math.routes.ts";

const app = fastify();

app.get("/", async (_, reply) => {
  return reply.status(200).send({ message: "Sucesso! Servidor rodando." });
});

app.register(usersRoutes);
app.register(checkInsRoutes);
app.register(gymsRoutes);
app.register(mathRoutes);

export default app;
