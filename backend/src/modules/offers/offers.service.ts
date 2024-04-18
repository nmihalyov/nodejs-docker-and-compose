import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private dataSource: DataSource,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    console.log(createOfferDto);
    const { id } = user;
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId, id);

    if (!wish) {
      throw new NotFoundException('Желание по указанному ID не найдено');
    }

    if (id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя добавить предложение на свое желание',
      );
    }

    if (wish.raised + amount > wish.price) {
      throw new ForbiddenException(
        `Нельзя добавить предложение более, чем на ${wish.price - wish.raised}₽`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedWish = await this.wishesService.updateRaised(
        itemId,
        id,
        amount + wish.raised,
        queryRunner.manager,
      );

      createOfferDto.user = user;
      createOfferDto.wish = updatedWish;

      const offer = await queryRunner.manager.save(Offer, createOfferDto);

      await queryRunner.commitTransaction();

      return offer;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: ['user', 'wish'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'wish'],
    });
  }

  async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
  ): Promise<UpdateResult> {
    return this.offerRepository.update(id, updateOfferDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.offerRepository.delete({ id });
  }
}
