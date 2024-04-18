import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Length(1, 1024)
  @IsOptional()
  description?: string;
}
