import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesModule } from '../wishes/wishes.module';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    TypeOrmModule.forFeature([Wish]),
    WishesModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
