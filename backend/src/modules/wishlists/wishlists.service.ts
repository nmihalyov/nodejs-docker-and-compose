import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  private async checkWishlist(wishId: number) {
    const wishlist = await this.findOne(wishId);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  private async checkWishlistOwner(wishId: number, userId: number) {
    const wishlist = await this.checkWishlist(wishId);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return wishlist;
  }

  private async addWishesToWishlist<
    T extends CreateWishlistDto | UpdateWishlistDto,
  >(dto: T, userId: number) {
    const { itemsId } = dto;

    if (!itemsId?.length) {
      return;
    }

    dto.items = [];

    for (let i = 0; i < itemsId.length; i++) {
      const wishId = itemsId[i];
      const wish = await this.wishesService.findOne(wishId, userId);

      if (!wish) {
        throw new NotFoundException(`Подарок с ID: ${wishId} не найден`);
      }

      if (wish.owner.id !== userId) {
        throw new ForbiddenException('Невозможно добавить чужой подарок');
      }

      dto.items.push(wish);
    }
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    await this.addWishesToWishlist(createWishlistDto, userId);

    return this.wishlistRepository.save(createWishlistDto);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.checkWishlistOwner(id, userId);
    await this.addWishesToWishlist(updateWishlistDto, userId);

    const updatedWishlist = {
      ...wishlist,
      ...updateWishlistDto,
    };

    await this.wishlistRepository.save(updatedWishlist);

    return updatedWishlist;
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.checkWishlistOwner(id, userId);

    this.wishlistRepository.delete({ id });

    return wishlist;
  }
}
