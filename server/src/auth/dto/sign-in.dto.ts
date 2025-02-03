import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SignInDto {
    @IsNotEmpty({message: "Email cannot be empty!"})
    @IsEmail()
    readonly email: string;
    
    @IsNotEmpty({message: "Password cannot be empty!"})
    @IsString({message: "Password must be a string!"})
    readonly password: string;
}