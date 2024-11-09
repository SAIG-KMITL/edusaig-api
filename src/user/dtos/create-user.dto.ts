import { IsString, IsEmail, IsStrongPassword, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "src/shared/enums/roles.enum";
import { ApiProperty } from "@nestjs/swagger";

enum AvailableRoles {
    STUDENT = Role.STUDENT,
    TEACHER = Role.TEACHER,
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'User email',
        type: String,
        example: 'johndoe@gmail.com',
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'User username',
        type: String,
        example: 'johndoe',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'User fullname',
        type: String,
        example: 'John Doe',
    })
    fullname: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty({
        description: 'User password',
        type: String,
        example: 'P@ssw0rd!',
    })
    password: string;

    @IsEnum(AvailableRoles, {
        message: `Invalid role. Role should be either ${Role.STUDENT} or ${Role.TEACHER}`,
    })
    @IsNotEmpty()
    @ApiProperty({
        description: 'User role',
        type: String,
        example: Role.STUDENT,
        enum: [Role.STUDENT, Role.TEACHER],
    })
    role: Role.STUDENT | Role.TEACHER;
}