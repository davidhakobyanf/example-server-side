  import { Controller, HttpCode, UsePipes } from '@nestjs/common';
  import { StoreService } from './store.service';
  import { Auth } from 'src/auth/decorators/auth.decorator';
  import { Body, Get, Param, Post } from '@nestjs/common';
  import { CurrentUser } from 'src/user/decorators/user.decorator';
  import { CreateStoreDto } from './dto/create-store.dto';
  import { ValidationPipe } from '@nestjs/common';


  @Controller('store')
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
  }
