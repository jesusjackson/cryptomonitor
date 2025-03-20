import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CryptoController } from './crypto/crypto.controller';
import { CryptoService } from './crypto/crypto.service';
import { CryptoEntity } from './crypto/crypto.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres-db',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'crypto_db',
      entities: [CryptoEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CryptoEntity]),
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        // Instead of using the URL property, specify host and port directly:
        store: await redisStore({
          host: process.env.REDIS_HOST || 'redis-cache',
          port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        }),
        ttl: 300, // Cache expiry (5 minutes)
      }),
    }),
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class AppModule {}
