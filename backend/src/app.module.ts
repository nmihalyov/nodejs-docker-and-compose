import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import configuration from './configuration';
import { AuthModule } from './modules/auth/auth.module';
import { Offer } from './modules/offers/entities/offer.entity';
import { OffersModule } from './modules/offers/offers.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { Wish } from './modules/wishes/entities/wish.entity';
import { WishesModule } from './modules/wishes/wishes.module';
import { Wishlist } from './modules/wishlists/entities/wishlist.entity';
import { WishlistsModule } from './modules/wishlists/wishlists.module';

config({ path: `.env${process.env.NODE_ENV === 'dev' ? '.dev' : ''}` });

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: configService.get('database.type'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Wish, Offer, Wishlist],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          level: 'error',
          datePattern: 'DD-MM-YYYY',
          maxFiles: '14d',
          zippedArchive: true,
          format: winston.format.json(),
        }),
      ],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
