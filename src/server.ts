import app from "./app.ts"
import { env } from "./env/index.ts"

app.listen({
    host: env.HOST,
    port: env.PORT
}, () => console.log(`🐱‍👤 Servidor rodando no endereco https://${env.HOST}:${env.PORT}`))