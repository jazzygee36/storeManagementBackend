import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

let cachedApp: any; // Cache the app instance to avoid repeated initialization

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({
      origin: 'http://localhost:3000', // Replace with your frontend's URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // If you need to allow cookies
    });
    await app.init();
    cachedApp = server;
  }

  cachedApp(req, res); // Forward the request to the Express server
}
