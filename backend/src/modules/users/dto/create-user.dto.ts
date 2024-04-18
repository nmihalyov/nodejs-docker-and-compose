import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  username: string;

  @Length(2, 200)
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
