import { hash } from "bcrypt";
import { prisma } from "./src/lib/prisma.ts";

async function main() {
  console.log("🌱 Limpando banco de dados...");
  await prisma.checkIn.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔑 Gerando senha padrão...");
  const passwordHash = await hash("123456", 10);

  console.log("👤 Criando 130 usuários...");
  const users = await Promise.all(
    Array.from({ length: 130 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `Usuário Teste ${i + 1}`,
          email: `user${i + 1}@teste.com`,
          password: passwordHash,
        },
      }),
    ),
  );

  console.log("🏋️ Criando 130 academias...");
  const gyms = await Promise.all(
    Array.from({ length: 130 }).map((_, i) =>
      prisma.gym.create({
        data: {
          title: `Academia Monstro ${i + 1}`,
          description: "A melhor academia da região",
          phone: `1199999999${i}`,
          // Espalhando as academias um pouquinho usando a variação do index (i)
          latitude: String(-23.55052 + i * 0.001),
          longitude: String(-46.633309 + i * 0.001),
        },
      }),
    ),
  );

  console.log("✅ Criando check-ins aleatórios...");
  // Vamos fazer o Usuário 1 fazer check-in na Academia 1, Usuário 2 na Academia 2, etc.
  for (let i = 0; i < 130; i++) {
    await prisma.checkIn.create({
      data: {
        user_id: users[i].id,
        gym_id: gyms[i].id,
      },
    });
  }

  console.log("🚀 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
