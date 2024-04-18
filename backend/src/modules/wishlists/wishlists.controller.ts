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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    const { id: userId } = req.user;

    createWishlistDto.owner = req.user;
    createWishlistDto.description = createWishlistDto.description || '';

    return this.wishlistsService.create(createWishlistDto, userId);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = req.user.id;

    return this.wishlistsService.update(id, updateWishlistDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.wishlistsService.remove(id, req.user.id);
  }
}
