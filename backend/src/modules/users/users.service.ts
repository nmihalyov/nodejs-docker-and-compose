import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { removeHiddenOffersOwners } from 'src/common/helpers/removeHiddenOffersOwners';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async checkUser(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async create(createUserDto: CreateUserDto, id: number): Promise<User> {
    const userByName = await this.findByUsername(createUserDto.username, id);
    const userByEmail = await this.findByEmail(createUserDto.email, id);

    if (userByName || userByEmail) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hash;

    return this.userRepository.save(createUserDto);
  }

  async findAll(userId: number): Promise<User[]> {
    const users = await this.userRepository.find();

    users.forEach((user) => removeHiddenOffersOwners(user.wishes, userId));

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    removeHiddenOffersOwners(user.wishes, id);

    return user;
  }

  async findByUsername(username: string, userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    removeHiddenOffersOwners(user.wishes, userId);

    return user;
  }

  async findByUsernameWithPassword(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('entity')
      .select(['entity', 'entity.password'])
      .where('entity.username = :username', { username })
      .getOne();
  }

  async findByEmail(email: string, userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    removeHiddenOffersOwners(user.wishes, userId);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findOne(id);
    const { username, email } = updateUserDto;
    const userByName = await this.findByUsername(username, id);
    const userByEmail = await this.findByEmail(email, id);

    if (
      (userByName && username !== currentUser.username) ||
      (userByEmail && email !== currentUser.email)
    ) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const { password } = updateUserDto;

    await this.checkUser(id);

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    this.userRepository.update(id, updateUserDto);

    return this.findOne(id);
  }

  async findCurrentWishes(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishes.offers'],
    });

    removeHiddenOffersOwners(wishes, id);

    return wishes;
  }

  async findWishesByUsername(
    username: string,
    userId: number,
  ): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers'],
    });

    removeHiddenOffersOwners(wishes, userId);

    return wishes;
  }

  async findByQuery(query: string, userId: number): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :query OR user.email = :query', { query })
      .getMany();

    users.forEach((user) => removeHiddenOffersOwners(user.wishes, userId));

    return users;
  }
}
