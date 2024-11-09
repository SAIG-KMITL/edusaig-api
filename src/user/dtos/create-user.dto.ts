import { IsString, IsEmail, IsStrongPassword, IsEnum, IsNotEmpty } from "class-validator";
import { Roles } from "src/shared/enums/roles.enum";

enum AvailableRoles {
    STUDENT = Roles.STUDENT,
    TEACHER = Roles.TEACHER,
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsEnum(AvailableRoles, {
        message: `Invalid role. Role should be either ${Roles.STUDENT} or ${Roles.TEACHER}`,
    })
    @IsNotEmpty()
    role: Roles.STUDENT | Roles.TEACHER;
}