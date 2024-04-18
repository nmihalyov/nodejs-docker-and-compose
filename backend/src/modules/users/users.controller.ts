import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll(@Req() req) {
    return this.usersService.findAll(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('me')
  findCurrent(@Req() req) {
    const { id } = req.user;

    return this.usersService.findOne(id);
  }

  @Patch('me')
  async updateCurrent(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;

    return this.usersService.update(id, updateUserDto);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('me/wishes')
  findCurrentWishes(@Req() req) {
    return this.usersService.findCurrentWishes(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':username')
  findByUsername(@Param('username') username: string, @Req() req) {
    return this.usersService.findByUsername(username, req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':username/wishes')
  findWishesByUsername(@Param('username') username: string, @Req() req) {
    return this.usersService.findWishesByUsername(username, req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Post('find')
  findByQuery(@Req() req, @Body() findUserDto: FindUserDto) {
    return this.usersService.findByQuery(findUserDto.query, req.user.id);
  }
}
