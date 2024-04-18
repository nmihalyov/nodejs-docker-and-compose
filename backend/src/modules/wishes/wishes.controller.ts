import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const { user } = req;
    createWishDto.owner = user;

    return this.wishesService.create(createWishDto);
  }

  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll(@Req() req) {
    return this.wishesService.findAll(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('top')
  findTopWishes(@Req() req) {
    return this.wishesService.findTopWishes(req?.user?.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('last')
  findLastWishes(@Req() req) {
    return this.wishesService.findLastWishes(req?.user?.id);
  }

  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;

    return this.wishesService.findOne(id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;

    return this.wishesService.update(id, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;

    return this.wishesService.remove(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req) {
    const { user } = req;

    return this.wishesService.copy(id, user);
  }
}
