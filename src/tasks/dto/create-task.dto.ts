import { $Enums, PriorityLevel, } from "@prisma/client";
import { IsDate, IsDateString, isDateString, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsISO8601({
        strict: true,
        strictSeparator: true
    })
    @IsNotEmpty()
    deadline: Date;

    @IsEnum(PriorityLevel)
    @IsOptional()
    priorityLevel: PriorityLevel;

    assignedTo: string | null;

    @IsString()
    @IsNotEmpty()
    boardListId: string;


}
