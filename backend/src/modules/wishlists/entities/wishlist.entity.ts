import { IsUrl, Length } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @Length(0, 1500)
  description: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
