import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator"

export class CreateUserDto {
    @IsNotEmpty({message: "Username is required!"})
    @IsString({message: "Username must be a string!"})
    readonly username: string;

    @IsNotEmpty({message: "Email is required!"})
    @IsEmail()
    readonly email: string;

    @IsNotEmpty({message: "Password is required!"})
    @MinLength(8, {message: "Password min length is 8 symbols!"})
    @IsString({message: "password must be a string!"})
    readonly password: string;
}