import { Controller, Param, Get, UsePipes, ValidationPipe, Post, Put, Delete, Body } from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { HttpCode } from '@nestjs/common';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get()
  async getByStoreId(
    @Param('id') storeId:string,
  ) {
    return this.colorService.getById(storeId)
  }

  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') id:string,
  ) {
    return this.colorService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Param('storeId') storeId:string, @Body() dto: ColorDto) {
    return this.colorService.create(storeId, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') id:string, @Body() dto:ColorDto) {
    return this.colorService.update(id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id:string) {
     return this.colorService.delete(id)
  }
}
