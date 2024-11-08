import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}