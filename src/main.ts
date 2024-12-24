import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors(); // Optional: Enable CORS if required
  await app.init();
}
bootstrap();
export const handler = server;
