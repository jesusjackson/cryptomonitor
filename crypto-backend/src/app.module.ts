import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CryptoController } from './crypto/crypto.controller';
import { CryptoService } from './crypto/crypto.service';
import { CryptoEntity } from './crypto/crypto.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'crypto_db',
      entities: [CryptoEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CryptoEntity]),
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class AppModule {}
