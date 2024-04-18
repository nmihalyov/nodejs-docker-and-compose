import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from '../../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signin(@Req() req, @Body() signinDto: SigninDto) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Req() req, @Body() createUserDto: CreateUserDto) {
    const { id } = req.user;
    const user = await this.usersService.create(createUserDto, id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    this.authService.auth(user);

    return result;
  }
}
