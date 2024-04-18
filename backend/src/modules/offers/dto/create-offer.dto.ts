import { IsBoolean, IsNumber } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { Wish } from 'src/modules/wishes/entities/wish.entity';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  user: User;

  wish: Wish;
}
