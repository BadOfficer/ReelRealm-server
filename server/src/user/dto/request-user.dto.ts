import { Role } from "@prisma/client";
import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator"

export class RequestUserDto {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    readonly password: string;

    @IsOptional()
    readonly role: Role
}