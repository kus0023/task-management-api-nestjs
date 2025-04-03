import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ShareBoardWithDto {

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    boardId: string;

    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsMongoId({ each: true })
    @IsArray()
    userIds: string[];
}