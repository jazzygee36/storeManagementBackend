// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';

// const server = express();
// let cachedApp: any;

// export default async function handler(
//   req: express.Request,
//   res: express.Response,
// ) {
//   if (!cachedApp) {
//     const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

//     // Dynamically set allowed origins based on environment
//     const allowedOrigins = [
//       'http://localhost:3000', // Development frontend URL
//       'https://storesinventory.netlify.app', // Production frontend URL
//     ];

//     app.enableCors({
//       origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//       credentials: true,
//     });

//     await app.init();
//     cachedApp = server;
//   }
//   cachedApp(req, res);
// }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow cookies
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

export default server;
