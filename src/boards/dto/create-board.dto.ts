import { Optional } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
    id?: string;
    @IsString()
    @IsNotEmpty()
    name: string;
    updateAt?: Date | string;

    @Optional()
    userId: string;
    createdAt?: Date | string;
}
