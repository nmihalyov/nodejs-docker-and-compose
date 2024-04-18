import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HideOwner } from 'src/common/interceptors/hideOwner.interceptor';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @UseInterceptors(HideOwner)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseInterceptors(HideOwner)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOne(id);
  }
}
