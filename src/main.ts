import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedApp: any;

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({
      origin: 'https://your-frontend.vercel.app', // Update for production frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.init();
    cachedApp = server;
  }
  cachedApp(req, res);
}
