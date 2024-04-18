import { IsOptional, IsUrl, Length } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { Wish } from 'src/modules/wishes/entities/wish.entity';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  itemsId: number[];

  @Length(0, 1500)
  @IsOptional()
  description?: string;

  items?: Wish[];

  owner?: User;
}
