import { Length } from 'class-validator';

export class FindUserDto {
  @Length(2)
  query: string;
}
