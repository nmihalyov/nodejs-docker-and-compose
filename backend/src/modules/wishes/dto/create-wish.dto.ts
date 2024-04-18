import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @Length(1, 1024)
  description: string;

  owner: User;
}
