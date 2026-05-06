import { Controller, Delete, HttpCode, Patch, Put, UsePipes } from '@nestjs/common';
  import { StoreService } from './store.service';
  import { Auth } from 'src/auth/decorators/auth.decorator';
  import { Body, Get, Param, Post } from '@nestjs/common';
  import { CurrentUser } from 'src/user/decorators/user.decorator';
  import { CreateStoreDto } from './dto/create-store.dto';
  import { ValidationPipe } from '@nestjs/common';
import { UpdateStoreDto } from './dto/update-store.dto';


  @Controller('stores')
  export class StoreController {
    constructor(private readonly storeService: StoreService) {}
    

    @Auth()
    @Get('by-id/:id')
    async getById(
      @Param('id') storeId:string, 
      @CurrentUser('id') userId:string
    ){
      return this.storeService.getById(storeId, userId)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Auth()
    @Post()
    async create(
      @CurrentUser('id')  userId:string,
      @Body() dto:CreateStoreDto
    ) {
      return this.storeService.create(userId, dto)
    }
    
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Auth()
    @Put(':id')
    async update(
      @CurrentUser('id')  userId:string,
      @Param('id') storeId:string,
      @Body() dto:UpdateStoreDto
    ) {
      return this.storeService.update(storeId, userId, dto)
    }

    @HttpCode(200)
    @Auth()
    @Delete(':id')
    async delete(
      @CurrentUser('id')  userId:string,
      @Param('id') storeId:string
    ) {
      return this.storeService.delete(storeId, userId)
    }
  }
