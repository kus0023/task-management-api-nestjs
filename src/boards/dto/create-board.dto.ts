import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
    id?: string;
    @IsString()
    @IsNotEmpty()
    name: string;
    updateAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCreatedInput;
    createdAt?: Date | string;
    BoardList?: Prisma.BoardListCreateNestedManyWithoutBoardDetailInput;
}
