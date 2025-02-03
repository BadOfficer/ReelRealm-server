import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString({message: "Username must be a string!"})
    username: string

    @IsOptional()
    @IsEnum(Role, {message: "Role must be a valid value!"})
    role: Role
}