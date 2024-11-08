import { IsString, IsEmail, IsStrongPassword, IsEnum, IsNotEmpty } from "class-validator";
import { Roles } from "src/shared/enums/roles.enum";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsEnum(Roles)
    @IsNotEmpty()
    role: Roles;
}