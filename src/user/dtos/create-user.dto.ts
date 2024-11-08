import { IsString, IsEmail, IsStrongPassword, IsEnum } from "class-validator";
import { Roles } from "src/shared/enums/roles.enum";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(Roles)
    role: Roles;
}