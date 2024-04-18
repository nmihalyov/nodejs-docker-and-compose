import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @Length(2, 200)
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @Length(8)
  @IsOptional()
  password?: string;
}
