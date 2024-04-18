import { IsBoolean, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class UpdateOfferDto {
  @IsUrl()
  @IsOptional()
  item?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
