import { IsOptional, IsString } from "class-validator";
import { CreateStoreDto } from "./create-store.dto";


export class UpdateStoreDto extends CreateStoreDto{
    @IsOptional()
    @IsString({
        message:'Описание должно быть строкой'
    })
    description?: string
}