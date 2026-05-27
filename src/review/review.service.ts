import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewDto } from './dto/review.dto';

import { ProductService } from 'src/product/product.service';
@Injectable()
export class ReviewService {
    constructor(
        private prisma:PrismaService,
        private productService: ProductService,
    ) {}

    async getByStoreId(storeId: string) {
        return this.prisma.review.findMany({
            where: {
                storeId
            },
            include: {
                user: true
            }
        })
    }

    async getById(id: string, userId:string) {
        const review = await this.prisma.review.findUnique({
            where:{
                id,
                userId
            },
            include: {
                user: true
            }
        })

        if (!review) throw new NotFoundException('Отзыв не найден')

        return review;
    }

    async create(
        userId:string,
        productId:string,
        storeId:string,
        dto:ReviewDto,


    ){

        await this.productService.getById(productId)


        return this.prisma.review.create({
            data:{
                ...dto,
                product:{
                    connect:{
                        id:productId
                    }
                },
                user:{
                    connect:{
                        id:userId
                    }
                },
                store:{
                    connect:{
                        id:storeId
                    }
                }
            }
        })
    }
    async delete(id:string, userId:string){
        await this.getById(id,userId)

        return this.prisma.review.delete({
            where:{
                id
            }
        })
    }
}
