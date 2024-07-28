import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cluster from "node:cluster";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

if (cluster.isPrimary) {
  console.log(`Master server started on ${process.pid}`);
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker: ${worker.process.pid} | code: ${code} | signal: ${signal} died. Restarting`);
    cluster.fork();
  });
} else {
  console.log(`Cluster server started on ${process.pid}`);
  bootstrap().then();
}
