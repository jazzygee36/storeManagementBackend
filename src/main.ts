import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors(); // Enable CORS if necessa

    // Listen on the port that Vercel provides, i.e., process.env.PORT
    // await app.listen(4000);
    console.log('🚀 Application is deployed successfully!');
  } catch (err) {
    console.error('Error during app initialization', err);
  }
}

bootstrap();

export default server;
