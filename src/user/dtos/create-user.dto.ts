import { IsString, IsEmail, IsStrongPassword, IsEnum, IsNotEmpty } from "class-validator";
import { AvailableRoles, Role } from "src/shared/enums/roles.enum";
import { ApiProperty } from "@nestjs/swagger";

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
        message: `Invalid role. Role should be either ${AvailableRoles.STUDENT} or ${AvailableRoles.TEACHER}`,
    })
    @IsNotEmpty()
    @ApiProperty({
        description: 'User role',
        type: String,
        example: AvailableRoles.STUDENT,
        enum: AvailableRoles,
    })
    role: Role;
}