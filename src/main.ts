import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function bootstrap() {
  try {
    // const app = await NestFactory.create(AppModule);
    // await app.listen(process.env.PORT ?? 3000);
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors(); // Enable CORS for cross-origin requests
    await app.init(); // Initialize the NestJS application
  } catch (err) {
    console.error('Error during app initialization', err);
  }
}
bootstrap();

export default server; // Export the server for Vercel
