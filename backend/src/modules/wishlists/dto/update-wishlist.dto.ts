import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/modules/wishes/entities/wish.entity';

export class UpdateWishlistDto {
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @Length(0, 1500)
  @IsOptional()
  description?: string;

  itemsId?: number[];

  @IsUrl()
  @IsOptional()
  image?: string;

  items?: Wish[];
}
