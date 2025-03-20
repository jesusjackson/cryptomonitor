import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.enableCors(); // Enable CORS for frontend
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running at http://localhost:${port}`);
}
bootstrap();