import { IsString } from "class-validator";
export class ColorDto {
    @IsString({
        message: 'Название цвета должно быть строкой'
    })
    name:string;

    @IsString({
        message:'Значение цвета должно быть строкой'
    })
    value:string;
    



}