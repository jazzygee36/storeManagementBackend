import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
const server = express();

async function bootstrap() {
  try {
    // const app = await NestFactory.create(AppModule);
    // await app.listen(process.env.PORT ?? 3000);
    // Create the NestJS application with an Express adapter

    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.setGlobalPrefix('api');
    // Enable CORS for cross-origin requests
    app.enableCors();

    // Initialize the NestJS application
    await app.init();
    console.log(`🚀 Application is deployed successfully!`);
  } catch (err) {
    console.error('Error during app initialization', err);
  }
}
bootstrap();

export default server; // Export the server for Vercel
