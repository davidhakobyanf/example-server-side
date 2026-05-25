import { IsNumber, IsNotEmpty, IsString, ArrayMinSize, IsOptional } from "class-validator";

export class ProductDto {
    @IsString({
        message: 'Название должно быть строкой'
    })
    @IsNotEmpty({
        message: 'Название обязательно'
    })
    title:string;

    @IsString({
        message: 'Описание должно быть строкой'
    })
    @IsNotEmpty({
        message: 'Описание обязательно'
    })
    description:string;

    @IsNumber({}, {message: 'Цена должна быть числом'})
    @IsNotEmpty({
        message: 'Цена не должна быть пустой'
    })
    price:number;

    @IsString({
        message:'Укажите хотя бы одно изображение',
        each:true
    })
    @ArrayMinSize(1,{message:'Должна быть хотя бы одно картинка'})
    @IsNotEmpty({
        each:true,
        message:'Изображения не должны быть пустыми'
    })
    images:string[];

    @IsOptional()
    @IsString({
        message: 'Категория должна быть строкой',
    })
    categoryId?: string;

    @IsOptional()
    @IsString({
        message: 'Цвет должен быть строкой',
    })
    colorId?: string;
}