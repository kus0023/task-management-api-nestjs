import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class AssignTaskDto {

    @IsMongoId()
    @IsNotEmpty()
    @IsString()
    taskId: string;

    @IsMongoId()
    @IsNotEmpty()
    @IsString()
    userId: string;
}